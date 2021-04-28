const fs = require('fs');
const Web3Utils = require('web3-utils');

const Storage = artifacts.require("Storage");
const AddressStorage = artifacts.require("AddressStorage");
const SettingStorage = artifacts.require("SettingStorage");
const IssuerStorage = artifacts.require("IssuerStorage");
const EscrowStorage = artifacts.require("EscrowStorage");
const LiquidatorStorage = artifacts.require("LiquidatorStorage");
const StakerStorage = artifacts.require("StakerStorage");
const OracleStorage = artifacts.require("OracleStorage");
const TraderStorage = artifacts.require("TraderStorage");
const TokenStorage = artifacts.require("TokenStorage");

const Setting = artifacts.require("Setting");
const Resolver = artifacts.require("Resolver");
const Issuer = artifacts.require("Issuer");
const Escrow = artifacts.require("Escrow");
const History = artifacts.require("History");
const Liquidator = artifacts.require("Liquidator");
const Staker = artifacts.require("Staker");
const AssetPrice = artifacts.require("AssetPrice");
const Oracle = artifacts.require("SynthxOracle");
const Trader = artifacts.require("Trader");
const Market = artifacts.require("Market");
const SupplySchedule = artifacts.require("SupplySchedule");
const Stats = artifacts.require("Stats");
const Synthx = artifacts.require("Synthx");

const Synth = artifacts.require("Synth");
const SynthxToken = artifacts.require("SynthxToken");   // sDIP
const SynthxDToken = artifacts.require("SynthxDToken"); // DToken

function checkUndefined(obj) {
    if (obj == undefined) {
        console.log('undefined');
        process.exit(-1);
    } else {
        console.log(obj.address);
    }
}

module.exports = function(deployer, network, accounts) {
    let contracts = {};
    let contractsAddrs = {};

    deployer
        .then(function() {
            return deployer.deploy(Setting);
        })
        .then((setting) => {
            checkUndefined(setting);
            contracts.setting = setting;
            contractsAddrs.setting = setting.address;
            return deployer.deploy(Resolver);
        })
        .then((resolver) => {
            checkUndefined(resolver);
            contracts.resolver = resolver;
            contractsAddrs.resolver = resolver.address;
            return deployer.deploy(Escrow, contracts.resolver.address);
        })
        .then((escrow) => {
            checkUndefined(escrow);
            contracts.escrow = escrow;
            contractsAddrs.escrow = escrow.address;
            return deployer.deploy(Issuer, contracts.resolver.address);
        })
        .then((issuer) => {
            checkUndefined(issuer);
            contracts.issuer = issuer;
            contractsAddrs.issuer = issuer.address;
            return deployer.deploy(History, contracts.resolver.address);
        })
        .then((history) => {
            checkUndefined(history);
            contracts.history = history;
            contractsAddrs.history = history.address;
            return deployer.deploy(Liquidator, contracts.resolver.address);
        })
        .then((liquidator) => {
            checkUndefined(liquidator);
            contracts.liquidator = liquidator;
            contractsAddrs.liquidator = liquidator.address;
            return deployer.deploy(Staker, contracts.resolver.address);
        })
        .then((staker) => {
            checkUndefined(staker);
            contracts.staker = staker;
            contractsAddrs.staker = staker.address;
            return deployer.deploy(AssetPrice);
        })
        .then((assetPrice) => {
            checkUndefined(assetPrice);
            contracts.assetPrice = assetPrice;
            contractsAddrs.assetPrice = assetPrice.address;
            return deployer.deploy(Oracle);
        })
        .then((oracle) => {
            checkUndefined(oracle);
            contracts.oracle = oracle;
            contractsAddrs.oracle = oracle.address;
            return deployer.deploy(Trader, Resolver.address);
        })
        .then((trader) => {
            checkUndefined(trader);
            contracts.trader = trader;
            contractsAddrs.trader = trader.address;
            return deployer.deploy(Market, Resolver.address);
        })
        .then((market) => {
            checkUndefined(market);
            contracts.market = market;
            contractsAddrs.market = market.address;
            return deployer.deploy(SupplySchedule, Resolver.address, 0, 0);
        })
        .then((supplySchedule) => {
            checkUndefined(supplySchedule);
            contracts.supplySchedule = supplySchedule;
            contractsAddrs.supplySchedule = supplySchedule.address;
            return deployer.deploy(Stats, Resolver.address);
        })
        .then((stats) => {
            checkUndefined(stats);
            contracts.stats = stats;
            contractsAddrs.stats = stats.address;
            return deployer.deploy(Synthx);
        })
        .then((synthx) => {
            checkUndefined(synthx);
            contracts.synthx = synthx;
            contractsAddrs.synthx = synthx.address;
            return deployer.deploy(Storage);
        })
        .then((storage) => {
            contracts.storage = storage;
            checkUndefined(contracts.storage);
            return deployer.deploy(AddressStorage);
        })
        .then((addressStorage) => {
            contracts.addressStorage = addressStorage;
            checkUndefined(contracts.addressStorage);
            return deployer.deploy(SettingStorage, contracts.setting.address);
        })
        .then((settingStorage) => {
            contracts.settingStorage = settingStorage;
            checkUndefined(contracts.settingStorage);
            return deployer.deploy(EscrowStorage, contracts.escrow.address);
        })
        .then((escrowStorage) => {
            contracts.escrowStorage = escrowStorage;
            checkUndefined(contracts.escrowStorage);
            return deployer.deploy(IssuerStorage, contracts.issuer.address);
        })
        .then((issuerStorage) => {
            contracts.issuerStorage = issuerStorage;
            checkUndefined(contracts.issuerStorage);
            return deployer.deploy(LiquidatorStorage, contracts.liquidator.address);
        })
        .then((liquidatorStorage) => {
            contracts.liquidatorStorage = liquidatorStorage;
            checkUndefined(contracts.liquidatorStorage);
            return deployer.deploy(StakerStorage, contracts.staker.address);
        })
        .then((stakerStorage) => {
            contracts.stakerStorage = stakerStorage;
            checkUndefined(contracts.stakerStorage);
            return deployer.deploy(OracleStorage, contracts.oracle.address);
        })
        .then((oracleStorage) => {
            contracts.oracleStorage = oracleStorage;
            checkUndefined(contracts.oracleStorage);
            return deployer.deploy(TraderStorage, contracts.trader.address);
        })
        .then((traderStorage) => {
            contracts.traderStorage = traderStorage;
            checkUndefined(contracts.traderStorage);
            return contracts.setting.setStorage(contracts.settingStorage.address);
        })
        .then((receipt) => {
            console.log('setting.setStorage receipts: ', receipt);
            return contracts.escrow.setStorage(contracts.escrowStorage.address);
        })
        .then((receipt) => {
            console.log('escrow.setStorage receipts: ', receipt);
            return contracts.issuer.setStorage(contracts.issuerStorage.address);
        })
        .then((receipt) => {
            console.log('issuer.setStorage receipts: ', receipt);
            return contracts.liquidator.setStorage(contracts.liquidatorStorage.address);
        })
        .then((receipt) => {
            console.log('liquidator.setStorage receipts: ', receipt);
            return contracts.staker.setStorage(contracts.stakerStorage.address);
        })
        .then((receipt) => {
            console.log('staker.setStorage receipts: ', receipt);
            return contracts.oracle.setStorage(contracts.oracleStorage.address);
        })
        .then((receipt) => {
            console.log('oracle.setStorage receipts: ', receipt);
            return contracts.trader.setStorage(contracts.traderStorage.address);
        })
        .then((receipt) => {
            console.log('trader.setStorage receipts: ', receipt);
            return contracts.synthx.initialize(Resolver.address, Web3Utils.fromAscii('ETH'));
        })
        .then((receipt) => {
            console.log('synthx.initialize receipt:', receipt);
            // resolver.setAddress should be done before tokens initialize
            return contracts.resolver.setAddress(Web3Utils.fromAscii('Issuer'), contracts.issuer.address);
        })
        .then((receipt) => {
            console.log('resolver.setStorage receipts: ', receipt);
            return deployer.deploy(Synth);
        })
        .then((dUSD) => {
            checkUndefined(dUSD);
            contracts.dUSD = dUSD;
            contractsAddrs.dUSD = dUSD.address;
            return deployer.deploy(SynthxToken);
        })
        .then((synthxToken) => {
            checkUndefined(synthxToken);
            contracts.synthxToken = synthxToken;
            contractsAddrs.synthxToken = synthxToken.address;
            return deployer.deploy(SynthxDToken, Resolver.address);
        })
        .then((synthxDToken) => {
            checkUndefined(synthxDToken);
            contracts.synthxDToken = synthxDToken;
            contractsAddrs.synthxDToken = synthxDToken.address;
            return deployer.deploy(Synth);
        })
        .then((dTSLA) => {
            checkUndefined(dTSLA);
            contracts.dTSLA = dTSLA;
            contractsAddrs.dTSLA = dTSLA.address;
            return deployer.deploy(Synth);
        })
        .then((dAPPLE) => {
            checkUndefined(dAPPLE);
            contracts.dAPPLE = dAPPLE;
            contractsAddrs.dAPPLE = dAPPLE.address;
            return deployer.deploy(TokenStorage, contracts.dUSD.address);
        })
        .then((dUSDStorage) => {
            contracts.dUSDStorage = dUSDStorage;
            checkUndefined(contracts.dUSDStorage);
            return deployer.deploy(TokenStorage, contracts.synthxToken.address);
        })
        .then((synthxTokenStorage) => {
            contracts.synthxTokenStorage = synthxTokenStorage;
            checkUndefined(contracts.synthxTokenStorage);
            return deployer.deploy(TokenStorage, contracts.synthxDToken.address);
        })
        .then((synthxDTokenStorage) => {
            contracts.synthxDTokenStorage = synthxDTokenStorage;
            checkUndefined(contracts.synthxDTokenStorage);
            return deployer.deploy(TokenStorage, contracts.dTSLA.address);
        })
        .then((dTSLAStorage) => {
            contracts.dTSLAStorage = dTSLAStorage;
            checkUndefined(contracts.dTSLAStorage);
            return deployer.deploy(TokenStorage, contracts.dAPPLE.address);
        })
        .then((dAPPLEStorage) => {
            contracts.dAPPLEStorage = dAPPLEStorage;
            checkUndefined(contracts.dAPPLEStorage);
            return contracts.dUSD.setStorage(contracts.dUSDStorage.address);
        })
        .then((receipt) => {
            console.log('dUSD.setStorage receipts: ', receipt);
            return contracts.synthxToken.setStorage(contracts.synthxTokenStorage.address);
        })
        .then((receipt) => {
            console.log('synthxToken.setStorage receipts: ', receipt);
            return contracts.synthxDToken.setStorage(contracts.synthxDTokenStorage.address);
        })
        .then((receipt) => {
            console.log('synthxDToken.setStorage receipts: ', receipt);
            return contracts.dTSLA.setStorage(contracts.dTSLAStorage.address);
        })
        .then((receipt) => {
            console.log('dTSLA.setStorage receipts: ', receipt);
            return contracts.dAPPLE.setStorage(contracts.dAPPLEStorage.address);
        })
        .then((receipt) => {
            console.log('dAPPLE.setStorage receipts: ', receipt);
            return contracts.dUSD.initialize(contracts.issuer.address, "dUSD", "dUSD", Web3Utils.fromAscii('erc20'));
        })
        .then((receipt) => {
            console.log('dUSD.initialize receipts: ', receipt);
            return contracts.synthxToken.initialize(contracts.resolver.address);
        })
        .then((receipt) => {
            console.log('synthxToken.initialize receipts: ', receipt);
            return contracts.synthxDToken.initialize();
        })
        .then((receipt) => {
            console.log('synthxDToken.initialize receipts: ', receipt);
            return contracts.dTSLA.initialize(contracts.issuer.address, "dTSLA", "dTSLA", Web3Utils.fromAscii('2'));
        })
        .then((receipt) => {
            console.log('dTSLA.initialize receipts: ', receipt);
            return contracts.dAPPLE.initialize(contracts.issuer.address, "dAPPLE", "dAPPLE", Web3Utils.fromAscii('2'));
        })
        .then((receipt) => {
            console.log('dAPPLE.initialize receipts: ', receipt);
            return contracts.oracle.setPrice(Web3Utils.fromAscii('ETH'), Web3Utils.toWei('2000', 'ether'));
        })
        .then((receipt) => {
            console.log('oracle.setPrice(ETH) receipts: ', receipt);
            return contracts.oracle.setPrice(Web3Utils.fromAscii('BTC'), Web3Utils.toWei('50000', 'ether'));
        })
        .then((receipt) => {
            console.log('oracle.setPrice(BTC) receipts: ', receipt);
            return contracts.oracle.setPrice(Web3Utils.fromAscii('dTSLA'), Web3Utils.toWei('750', 'ether'));
        })
        .then((receipt) => {
            console.log('oracle.setPrice(dTSLA) receipts: ', receipt);
            return contracts.oracle.setPrice(Web3Utils.fromAscii('dAPPLE'), Web3Utils.toWei('150', 'ether'));
        })
        .then((receipt) => {
            console.log('oracle.setPrice(dAPPLE) receipts: ', receipt);
            return contracts.assetPrice.setOracle(Web3Utils.fromAscii('ETH'), contracts.oracle.address);
        })
        .then((receipt) => {
            console.log('assetPrice.setOracle(ETH) receipts: ', receipt);
            return contracts.assetPrice.setOracle(Web3Utils.fromAscii('BTC'), contracts.oracle.address);
        })
        .then((receipt) => {
            console.log('assetPrice.setOracle(BTC) receipts: ', receipt);
            return contracts.assetPrice.setOracle(Web3Utils.fromAscii('dTSLA'), contracts.oracle.address);
        })
        .then((receipt) => {
            console.log('assetPrice.setOracle(dTSLA) receipts: ', receipt);
            return contracts.assetPrice.setOracle(Web3Utils.fromAscii('dAPPLE'), contracts.oracle.address);
        })
        .then((receipt) => {
            console.log('assetPrice.setOracle(dAPPLE) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('Escrow'), contracts.escrow.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(Escrow) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('Staker'), contracts.staker.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(Staker) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('AssetPrice'), contracts.assetPrice.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(AssetPrice) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('Setting'), contracts.setting.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(Setting) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('Oracle'), contracts.oracle.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(Oracle) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('Trader'), contracts.trader.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(Trader) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('Market'), contracts.market.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(Market) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('History'), contracts.history.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(History) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('Liquidator'), contracts.liquidator.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(Liquidator) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('SupplySchedule'), contracts.supplySchedule.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(SupplySchedule) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('Team'), accounts[0]);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(Team) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('Synthx'), contracts.synthx.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(Synthx) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('SynthxToken'), contracts.synthxToken.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(SynthxToken) receipts: ', receipt);
            return contracts.resolver.setAddress(Web3Utils.fromAscii('SynthxDToken'), contracts.synthxDToken.address);
        })
        .then((receipt) => {
            console.log('resolver.setAddress(SynthxDToken) receipts: ', receipt);
            return contracts.resolver.addAsset(Web3Utils.fromAscii('Stake'), Web3Utils.fromAscii('ETH'), accounts[0]);
        })
        .then((receipt) => {
            console.log('resolver.addAsset(Stake-ETH) receipts: ', receipt);
            return contracts.resolver.addAsset(Web3Utils.fromAscii('Synth'), Web3Utils.fromAscii('dUSD'), contracts.dUSD.address);
        })
        .then((receipt) => {
            console.log('resolver.addAsset(Synth-dUSD) receipts: ', receipt);
            return contracts.resolver.addAsset(Web3Utils.fromAscii('Synth'), Web3Utils.fromAscii('dTSLA'), contracts.dTSLA.address);
        })
        .then((receipt) => {
            console.log(receipt);
            console.log('resolver.addAsset(Synth-dTSLA) receipts: ', receipt);
            return contracts.resolver.addAsset(Web3Utils.fromAscii('Synth'), Web3Utils.fromAscii('dAPPLE'), contracts.dAPPLE.address);
        })
        .then((receipt) => {
            console.log('resolver.addAsset(Synth-dAPPLE) receipts: ', receipt);
            return contracts.synthx.refreshCache();
        })
        .then((receipt) => {
            console.log('synthx.refreshCache receipt: ', receipt);
            return contracts.escrow.refreshCache();
        })
        .then((receipt) => {
            console.log('escrow.refreshCache receipt: ', receipt);
            return contracts.staker.refreshCache();
        })
        .then((receipt) => {
            console.log('staker.refreshCache receipt: ', receipt);
            return contracts.trader.refreshCache();
        })
        .then((receipt) => {
            console.log('trader.refreshCache receipt: ', receipt);
            return contracts.market.refreshCache();
        })
        .then((receipt) => {
            console.log('market.refreshCache receipt: ', receipt);
            return contracts.history.refreshCache();
        })
        .then((receipt) => {
            console.log('history.refreshCache receipt: ', receipt);
            return contracts.liquidator.refreshCache();
        })
        .then((receipt) => {
            console.log('liquidator.refreshCache receipt: ', receipt);
            return contracts.issuer.refreshCache();
        })
        .then((receipt) => {
            console.log('issuer.refreshCache receipt: ', receipt);
            return contracts.supplySchedule.refreshCache();
        })
        .then((receipt) => {
            console.log('supplySchedule.refreshCache receipt: ', receipt);
            return contracts.stats.refreshCache();
        })
        .then((receipt) => {
            console.log('stats.refreshCache receipt: ', receipt);
            return contracts.synthxDToken.refreshCache();
        })
        .then((receipt) => {
            console.log('synthxDToken.refreshCache receipt: ', receipt);
            return contracts.setting.setCollateralRate(Web3Utils.fromAscii('ETH'), Web3Utils.toWei('2', 'ether'));
        })
        .then((receipt) => {
            console.log('setting.setCollateralRate receipt: ', receipt);
            return contracts.setting.setLiquidationRate(Web3Utils.fromAscii('ETH'), Web3Utils.toWei('1', 'ether'));
        })
        .then((receipt) => {
            console.log('setting.setLiquidationRate receipt: ', receipt);
            return contracts.setting.setLiquidationDelay(36000);
        })
        .then((receipt) => {
            console.log('setting.setLiquidationDelay receipt: ', receipt);
            return contracts.setting.setTradingFeeRate(Web3Utils.fromAscii('ETH'), Web3Utils.toWei('2', 'milliether'));
        })
        .then((receipt) => {
            console.log('setting.setTradingFeeRate receipt: ', receipt);
            return contracts.setting.setMintPeriodDuration(1); // second
        })
        .then((receipt) => {
            console.log('setting.setMintPeriodDuration receipt: ', receipt);
            console.log("contracts deployment finished\n\n");

            const addrsData = JSON.stringify(contractsAddrs, null, '\t');

            fs.writeFile('contractsAddrs.json', addrsData, (err) => {
                if (err) {
                    throw err;
                }
                console.log("contractsAddrs saved");
            });
        })
};
