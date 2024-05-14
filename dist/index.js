"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeContractData = exports.AA = void 0;
var ethers_1 = require("ethers");
var account_1 = require("./account");
var helpers_1 = require("./utils/helpers");
var AA = /** @class */ (function () {
    function AA(apiKey, signer, env) {
        if (env === void 0) { env = "sepolia"; }
        this.apiKey = apiKey;
        this.signer = signer;
        this.env = env;
        this.rpcUrl = (0, helpers_1.getRpcUrl)(env);
    }
    AA.prototype.account = function (salt) {
        if (salt === void 0) { salt = "0"; }
        return new account_1.Account(this.apiKey, this.signer, this.env, salt);
    };
    return AA;
}());
exports.AA = AA;
function encodeContractData(data) {
    try {
        var contract = new ethers_1.Contract(data.address, data.abi);
        var callData = contract.interface.encodeFunctionData(data.functionName, data.args);
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
