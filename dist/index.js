"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeContractData = exports.AA = void 0;
const ethers_1 = require("ethers");
const account_1 = require("./account");
const helpers_1 = require("./utils/helpers");
class AA {
    apiKey;
    signer;
    env;
    rpcUrl;
    constructor(apiKey, signer, env = "sepolia") {
        this.apiKey = apiKey;
        this.signer = signer;
        this.env = env;
        this.rpcUrl = (0, helpers_1.getRpcUrl)(env);
    }
    account(salt = "0") {
        return new account_1.Account(this.apiKey, this.signer, this.env, salt);
    }
}
exports.AA = AA;
function encodeContractData(data) {
    try {
        const contract = new ethers_1.Contract(data.address, data.abi);
        const callData = contract.interface.encodeFunctionData(data.functionName, data.args);
        return {
            to: data.address,
            value: data.value || "0x",
            data: callData
        };
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.encodeContractData = encodeContractData;
