"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const ethers_1 = require("ethers");
const constants_1 = require("./utils/constants");
const EntryPoint_json_1 = require("../artifacts/EntryPoint.json");
const SimpleAccount_json_1 = __importDefault(require("../artifacts/SimpleAccount.json"));
const abis_1 = require("./utils/abis");
const helpers_1 = require("./utils/helpers");
class Account {
    apiKey;
    env;
    account;
    ethClient;
    walletClient;
    constructor(apiKey, signer, env, salt) {
        this.apiKey = apiKey;
        this.env = env;
        this.ethClient = new ethers_1.JsonRpcProvider(`${(0, helpers_1.getRpcUrl)(this.env)}${this.apiKey}`);
        this.walletClient = new ethers_1.BaseWallet(new ethers_1.SigningKey(signer), this.ethClient);
        this.account = this.initializeAccount(salt);
    }
    async initializeAccount(salt) {
        const entryPoint = new ethers_1.Contract(constants_1.ENTRYPOINT_ADDRESS, EntryPoint_json_1.abi, this.walletClient);
        const factory = new ethers_1.Contract(constants_1.FACTORY_ADDRESS, abis_1.FactoryAbi);
        let initCode = constants_1.FACTORY_ADDRESS + factory.interface.encodeFunctionData("createAccount", [await this.walletClient.getAddress(), salt]).slice(2);
        let address = "";
        try {
            await entryPoint.getSenderAddress(initCode);
        }
        catch (ex) {
            address = "0x" + ex.data.slice(-40);
        }
        const code = await this.ethClient.getCode(address);
        if (code !== "0x") {
            initCode = "0x";
        }
        return { address, initCode };
    }
    async getAddress() {
        return (await this.account).address;
    }
    async sendUserOp(tnxData, paymasterAndData) {
        const AccountContrtact = new ethers_1.ContractFactory(SimpleAccount_json_1.default.abi, SimpleAccount_json_1.default.bytecode);
        const entryPoint = new ethers_1.Contract(constants_1.ENTRYPOINT_ADDRESS, EntryPoint_json_1.abi, this.walletClient);
        const { address, initCode } = await this.account;
        const userOp = {
            sender: address, // smart account address
            nonce: "0x" + (await entryPoint.getNonce(address, 0)).toString(16),
            initCode,
            callData: AccountContrtact.interface.encodeFunctionData("execute", [tnxData.to, tnxData.value, tnxData.data || "0x"]),
            paymasterAndData: paymasterAndData || "0x",
            signature: (0, helpers_1.getDummySignatureByTotalSignersLength)(),
        };
        const { preVerificationGas, verificationGasLimit, callGasLimit } = await this.ethClient.send("eth_estimateUserOperationGas", [
            userOp,
            constants_1.ENTRYPOINT_ADDRESS,
        ]);
        console.log("preVerificationGas", parseInt(preVerificationGas));
        console.log("verificationGasLimit", parseInt(verificationGasLimit));
        console.log("callGasLimit", parseInt(callGasLimit));
        // update userOp with relevant gas info 
        userOp.preVerificationGas = preVerificationGas;
        userOp.verificationGasLimit = verificationGasLimit;
        userOp.callGasLimit = callGasLimit;
        // get more relevant gas info and update userOp
        const { maxFeePerGas, maxPriorityFeePerGas } = await this.ethClient.send("skandha_getGasPrice", []);
        console.log("maxFeePerGas", parseInt(maxFeePerGas.toString()));
        console.log("maxPriorityFeePerGas", parseInt(maxPriorityFeePerGas));
        userOp.maxFeePerGas = parseInt(maxFeePerGas.toString());
        userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;
        // Sign userOp hash with account signer
        const userOpHash = await entryPoint.getUserOpHash(userOp);
        const sig = await this.walletClient.signMessage((0, ethers_1.getBytes)(userOpHash));
        userOp.signature = sig;
        // execute transaction
        const opTxHash = await this.ethClient.send("eth_sendUserOperation", [
            userOp,
            constants_1.ENTRYPOINT_ADDRESS,
        ]);
        return {
            hash: opTxHash
        };
    }
    async sendUserOpBatch(tnxData, paymasterAndData) {
        const AccountContrtact = new ethers_1.ContractFactory(SimpleAccount_json_1.default.abi, SimpleAccount_json_1.default.bytecode);
        const entryPoint = new ethers_1.Contract(constants_1.ENTRYPOINT_ADDRESS, EntryPoint_json_1.abi, this.walletClient);
        const { address, initCode } = await this.account;
        const addresses = [];
        const datas = [];
        tnxData.forEach((t) => {
            addresses.push(t.to);
            datas.push(t.data || "0x");
        });
        const userOp = {
            sender: address, // smart account address
            nonce: "0x" + (await entryPoint.getNonce(address, 0)).toString(16),
            initCode,
            callData: AccountContrtact.interface.encodeFunctionData("executeBatch", [addresses, datas]),
            paymasterAndData: paymasterAndData || "0x",
            signature: (0, helpers_1.getDummySignatureByTotalSignersLength)(),
        };
        const { preVerificationGas, verificationGasLimit, callGasLimit } = await this.ethClient.send("eth_estimateUserOperationGas", [
            userOp,
            constants_1.ENTRYPOINT_ADDRESS,
        ]);
        console.log("preVerificationGas", parseInt(preVerificationGas));
        console.log("verificationGasLimit", parseInt(verificationGasLimit));
        console.log("callGasLimit", parseInt(callGasLimit));
        // update userOp with relevant gas info 
        userOp.preVerificationGas = preVerificationGas;
        userOp.verificationGasLimit = verificationGasLimit;
        userOp.callGasLimit = callGasLimit;
        // get more relevant gas info and update userOp
        const { maxFeePerGas, maxPriorityFeePerGas } = await this.ethClient.send("skandha_getGasPrice", []);
        console.log("maxFeePerGas", parseInt(maxFeePerGas.toString()));
        console.log("maxPriorityFeePerGas", parseInt(maxPriorityFeePerGas));
        userOp.maxFeePerGas = parseInt(maxFeePerGas.toString());
        userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;
        // Sign userOp hash with account signer
        const userOpHash = await entryPoint.getUserOpHash(userOp);
        const sig = await this.walletClient.signMessage((0, ethers_1.getBytes)(userOpHash));
        userOp.signature = sig;
        // execute transaction
        const opTxHash = await this.ethClient.send("eth_sendUserOperation", [
            userOp,
            constants_1.ENTRYPOINT_ADDRESS,
        ]);
        return {
            hash: opTxHash
        };
    }
    async getReceipt(hash) {
        const data = await this.ethClient.send("eth_getUserOperationReceipt", [
            hash
        ]);
        return data;
    }
}
exports.Account = Account;
