const fs = require('fs');
const Web3Utils = require('web3-utils');

const contractAddrs = require('../finalContractAddrs.json')

const Synthx = artifacts.require("Synthx");
const Synth = artifacts.require("Synth");
const Stats = artifacts.require("Stats");
const SynthxToken = artifacts.require("SynthxToken");
const SynthxDToken = artifacts.require("SynthxDToken");

module.exports = async function(deployer, network, accounts) {
    console.log(contractAddrs);

    let contracts = {};
    contracts.synthx = await Synthx.at(contractAddrs.synthx);
    contracts.dUSD = await Synth.at(contractAddrs.dUSD);
    contracts.stats = await Stats.at(contractAddrs.stats);
    contracts.synthxDToken = await SynthxDToken.at(contractAddrs.synthxDToken);
    contracts.synthxToken = await SynthxToken.at(contractAddrs.synthxToken);
    contracts.dTSLA = await Synth.at(contractAddrs.dTSLA);
    contracts.dAAPL = await Synth.at(contractAddrs.dAAPL);

    console.log(contracts.synthx.address);
    console.log(contracts.dUSD.address);
    console.log(contracts.stats.address);
    console.log(contracts.synthxDToken.address);
    console.log(contracts.dTSLA.address);
    console.log(contracts.dAAPL.address);

    console.log("-------- mint synths -------- ");
    await deployer
        .then(() => {
            return contracts.synthx.mintFromCoin(Web3Utils.toWei('1000', 'ether'), {value: Web3Utils.toWei('1', 'ether')});
        })
        .then((receipt) => {
            console.log('synthx.mintFromCoin receipt: ', receipt);
            return contracts.dUSD.balanceOf(accounts[0]);
        })
        .then((balance) => {
            console.log("dUSD balance:", Web3Utils.fromWei(balance, 'ether'));
            return contracts.synthxDToken.balanceOf(accounts[0]);
        })
        .then((balance) => {
            console.log("dToken balance:", Web3Utils.fromWei(balance, 'ether'));
            return contracts.stats.getTotalCollateral(accounts[0]);
        })
        .then((totalCollateral) => {
            console.log("totalDebt:", Web3Utils.fromWei(totalCollateral.totalDebt, 'ether'));

            console.log("\n-------- burn synths -------- ");
            return contracts.synthx.burn(Web3Utils.fromAscii('ETH'), Web3Utils.toWei('1', 'ether'));
        })
        .then((receipt) => {
            console.log('synthx.burn receipt: ', receipt);
            return contracts.dUSD.balanceOf(accounts[0]);
        })
        .then((balance) => {
            console.log("dUSD balance:", Web3Utils.fromWei(balance, 'ether'));
            return contracts.synthxDToken.balanceOf(accounts[0]);
        })
        .then((balance) => {
            console.log("dToken balance:", Web3Utils.fromWei(balance, 'ether'));
            return contracts.stats.getTotalCollateral(accounts[0]);
            new Promise(r => setTimeout(r, 2000));
        })
        .then((totalCollateral) => {
            console.log("totalDebt:", Web3Utils.fromWei(totalCollateral.totalDebt, 'ether'));
            return contracts.stats.getRewards(accounts[0]);
        })
        .then((reward) => {
            console.log("rewards: ", Web3Utils.fromWei(reward, 'ether'))

        //     console.log("-------- claim rewards -------- ");
            return contracts.synthx.claimReward();
        })
        .then((receipt) => {
            console.log('synthx.claimReward receipt: ', receipt);

        //     return contracts.synthxToken.balanceOf(accounts[0]);
        // })
        // .then((balance) => {
        //     console.log("synthx balance:", Web3Utils.fromWei(balance, 'ether'));

            console.log("-------- trade -------- ");
            // dUSD => dTSLA
            return contracts.synthx.trade(Web3Utils.fromAscii('dUSD'), Web3Utils.toWei('10', 'ether'), Web3Utils.fromAscii('dTSLA'));
        })
        .then((receipt) => {
            console.log('synthx.trade(dUSD => dTSLA) receipt: ', receipt);

            return contracts.dTSLA.balanceOf(accounts[0]);
        })
        .then((balance) => {
            console.log("dTSLA balance:", Web3Utils.fromWei(balance, 'ether'));

            // dTSLA => dAAPL
            return contracts.synthx.trade(Web3Utils.fromAscii('dTSLA'), Web3Utils.toWei('10', 'milliether'), Web3Utils.fromAscii('dAAPL'));
        })
        .then((receipt) => {
            console.log('synthx.trade(dTSLA => dAAPL) receipt: ', receipt);
            return contracts.dTSLA.balanceOf(accounts[0]);
        })
        .then((balance) => {
            console.log("dTSLA balance:", Web3Utils.fromWei(balance, 'ether'));
            return contracts.dAAPL.balanceOf(accounts[0]);
        })
        .then((balance) => {
            console.log("dAAPL balance:", Web3Utils.fromWei(balance, 'ether'));
            // get synth asset
            return contracts.stats.getAssets(Web3Utils.fromAscii('Synth'), accounts[0]);
        })
        .then((assets) => {
            console.log("synth assets:", assets);
            // get stake asset
            return contracts.stats.getAssets(Web3Utils.fromAscii('Stake'), accounts[0]);
        })
        .then((stakeAssets) => {
            console.log("stake assets:", stakeAssets);
            // get vaullts
            return contracts.stats.getVaults(accounts[0]);
        })
        .then((vaults) => {
            console.log("getVaults:", vaults);
            // getTotalCollateral
            return contracts.stats.getTotalCollateral(accounts[0]);
        })
        .then((totalCollateral) => {
            console.log("getTotalCollateral:", totalCollateral)
        });
}