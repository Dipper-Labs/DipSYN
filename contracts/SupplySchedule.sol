// SPDX-License-Identifier: MIT
pragma solidity ^0.5.17;

import './lib/SafeMath.sol';
import './lib/PreciseMath.sol';
import './base/Importable.sol';
import './interfaces/ISetting.sol';
import './interfaces/IEscrow.sol';
import './interfaces/IHistory.sol';

contract SupplySchedule is Importable, ISupplySchedule {
    using SafeMath for uint256;
    using PreciseMath for uint256;

    // 315360000 = 30 * 20(20blocks/minute) * 60 * 24 * 365
    uint256[] public SUPPLY_SCHEDULE = [31536E22, 15768E22, 7884E22, 3942E22, 1971E22, 9855E21];

    uint256 public startMintTime;
    uint256 public lastMintTime;
    mapping(bytes32 => uint256) public percentages;

    constructor(
        IResolver _resolver,
        uint256 _startMintTime,
        uint256 _lastMintTime
    ) public Importable(_resolver) {
        setContractName(CONTRACT_SUPPLY_SCHEDULE);
        imports = [
            CONTRACT_SYNTHX_TOKEN,
            CONTRACT_SETTIN,
            CONTRACT_STAKER,
            CONTRACT_FOUNDATION,
            CONTRACT_ECOLOGY,
            CONTRACT_HISTORY
        ];

        startMintTime = (_startMintTime == 0) ? now : _startMintTime;
        lastMintTime = (_lastMintTime < startMintTime) ? startMintTime : _lastMintTime;

        percentages[CONTRACT_STAKER] = 0.8 ether; // 80%
        percentages[CONTRACT_FOUNDATION] = 0.15 ether; // 15%
        percentages[CONTRACT_ECOLOGY] = 0.05 ether; // 5%
    }

    function Setting() private view returns (ISetting) {
        return ISetting(requireAddress(CONTRACT_SETTING));
    }

    function History() private view returns (IHistory) {
        return IHistory(requireAddress(CONTRACT_HISTORY));
    }

    function setPercentage(bytes32 recipient, uint256 percent) external onlyOwner {
        require(_isRecipient(recipient), 'SupplySchedule: invalid recipient');
        require(recipient != CONTRACT_STAKER, 'SupplySchedule: invalid recipient');

        emit SupplyPercentageChanged(recipient, percentages[recipient], percent);
        percentages[recipient] = percent;
        uint256 totalPercentage = _getTotalPercentageWithoutStaker();
        require(
            totalPercentage <= PreciseMath.DECIMAL_ONE(),
            'SupplySchedule: total percent must be no greater than 100%'
        );
        percentages[CONTRACT_STAKER] = PreciseMath.DECIMAL_ONE().sub(totalPercentage);
    }

    function _isRecipient(bytes32 recipient) private pure returns (bool) {
        return (recipient == CONTRACT_FOUNDATION ||
            recipient == CONTRACT_STAKER ||
            recipient == CONTRACT_ECOLOGY);
    }

    function _getTotalPercentageWithoutStaker() private view returns (uint256) {
        return percentages[CONTRACT_FOUNDATION]
            .add(percentages[CONTRACT_ECOLOGY]);
    }

    function distributeSupply()
        external
        onlyAddress(CONTRACT_SYNTHX_TOKEN)
        returns (address[] memory recipients, uint256[] memory amounts)
    {
        if (now < nextMintTime()) return (recipients, amounts);

        uint256 currentPeriod = currentPeriod();
        uint256 lastMintPeriod = lastMintPeriod();

        uint256 totalSupply = 0;
        uint256 traderSupply = 0;
        uint256 teamSupply = 0;
        uint256 escrowSupply = 0;

        for (uint256 i = lastMintPeriod; i < currentPeriod; i++) {
            uint256 supply = periodSupply(i);

            uint256 traderPeriodSupply = supply.decimalMultiply(percentages[CONTRACT_TRADER]);
            uint256 escrowPeriodSupply = supply.sub(traderSupply);

            traderSupply = traderSupply.add(traderPeriodSupply);
            escrowSupply = escrowSupply.add(escrowPeriodSupply);
            teamSupply = teamSupply.add(supply.decimalMultiply(percentages[CONTRACT_FOUNDATION]));
            totalSupply = totalSupply.add(traderSupply).add(escrowSupply);
        }

        if (totalSupply == 0) return (recipients, amounts);

        recipients = new address[](2);
        recipients[0] = requireAddress(CONTRACT_TRADER);
        recipients[1] = requireAddress(CONTRACT_ESCROW);
        amounts = new uint256[](2);
        amounts[0] = traderSupply;
        amounts[1] = escrowSupply;

        lastMintTime = now;
    }

    function mintableSupply(bytes32 recipient, uint256 period) external view returns (uint256) {
        if (lastMintPeriod() <= period) return 0;
        return periodSupply(recipient, period);
    }

    function periodSupply(bytes32 recipient, uint256 period) public view returns (uint256) {
        return periodSupply(period).decimalMultiply(percentages[recipient]);
    }

    function periodSupply(uint256 period) public view returns (uint256) {
        uint256 yearlyPeriods = _getYearlyPeriods();
        uint256 year = period.div(yearlyPeriods);
        if (year >= SUPPLY_SCHEDULE.length) year = SUPPLY_SCHEDULE.length.sub(1);
        return SUPPLY_SCHEDULE[year].div(yearlyPeriods);
    }

    function currentPeriod() public view returns (uint256) {
        return _getPeriod(now);
    }

    function lastMintPeriod() public view returns (uint256) {
        return _getPeriod(lastMintTime);
    }

    function nextMintTime() public view returns (uint256) {
        return lastMintTime.add(Setting().getMintPeriodDuration());
    }

    function _getPeriod(uint256 timestamp) private view returns (uint256) {
        if (timestamp <= startMintTime) return 0;
        return timestamp.sub(startMintTime).div(Setting().getMintPeriodDuration());
    }

    function _getYearlyPeriods() private view returns (uint256) {
        uint256 year = 365 days;
        return year.div(Setting().getMintPeriodDuration());
    }
}
