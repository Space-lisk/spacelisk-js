import { AddressLike, BaseWallet, BytesLike, Contract, ContractFactory, JsonRpcProvider, Signer, SigningKey, getBytes } from "ethers";
import { ENV, TnxData, UserOperationStruct } from "./types/global.types";
import { ENTRYPOINT_ADDRESS, FACTORY_ADDRESS } from "./utils/constants";
import { abi as ENTRYPOINT_ABI } from "../artifacts/EntryPoint.json";
import ACCOUNT from "../artifacts/SimpleAccount.json"
import { FactoryAbi } from "./utils/abis";
import { getDummySignatureByTotalSignersLength, getRpcUrl } from "./utils/helpers";

export class Account {
    private apiKey: string;
    private env: ENV;
    private account: Promise<{ address: string, initCode: string }>;
    private ethClient: JsonRpcProvider;
    private walletClient: Signer;

    constructor(apiKey: string, signer: `0x${string}`, env: ENV, salt: string) {
        this.apiKey = apiKey;
        this.env = env;
        this.ethClient = new JsonRpcProvider(`${getRpcUrl(this.env)}${this.apiKey}`);
        this.walletClient = new BaseWallet(new SigningKey(signer), this.ethClient);        
        this.account = this.initializeAccount(salt);
    }

    private async initializeAccount(salt:string) {

        const entryPoint = new Contract(ENTRYPOINT_ADDRESS, ENTRYPOINT_ABI, this.walletClient);

        const factory = new Contract(FACTORY_ADDRESS, FactoryAbi);

        let initCode = FACTORY_ADDRESS + factory.interface.encodeFunctionData(
            "createAccount",
            [await this.walletClient.getAddress(), salt]).slice(2);

        let address = "";
        try {
            await entryPoint.getSenderAddress(initCode);
        } catch (ex: any) {
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

    async sendUserOp(tnxData: TnxData, paymasterAndData?: string) {

        const AccountContrtact = new ContractFactory(ACCOUNT.abi, ACCOUNT.bytecode);
        const entryPoint = new Contract(ENTRYPOINT_ADDRESS, ENTRYPOINT_ABI, this.walletClient);
        const { address, initCode } = await this.account;

        const userOp: Partial<UserOperationStruct> = {
            sender: address, // smart account address
            nonce: "0x" + (await entryPoint.getNonce(address, 0)).toString(16),
            initCode,
            callData: AccountContrtact.interface.encodeFunctionData("execute", [tnxData.to, tnxData.value, tnxData.data || "0x"]),
            paymasterAndData: paymasterAndData || "0x",
            signature: getDummySignatureByTotalSignersLength(),
        };

        const { preVerificationGas, verificationGasLimit, callGasLimit } = await this.ethClient.send("eth_estimateUserOperationGas", [
            userOp,
            ENTRYPOINT_ADDRESS,
        ]);

        console.log("preVerificationGas", parseInt(preVerificationGas))
        console.log("verificationGasLimit", parseInt(verificationGasLimit))
        console.log("callGasLimit", parseInt(callGasLimit))

        // update userOp with relevant gas info 
        userOp.preVerificationGas = preVerificationGas;
        userOp.verificationGasLimit = verificationGasLimit;
        userOp.callGasLimit = callGasLimit;

        // get more relevant gas info and update userOp
        const { maxFeePerGas, maxPriorityFeePerGas } = await this.ethClient.send(
            "skandha_getGasPrice",
            []
        );
        console.log("maxFeePerGas", parseInt(maxFeePerGas!.toString()))
        console.log("maxPriorityFeePerGas", parseInt(maxPriorityFeePerGas))

        userOp.maxFeePerGas = parseInt(maxFeePerGas!.toString());
        userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

        // Sign userOp hash with account signer
        const userOpHash = await entryPoint.getUserOpHash(userOp as UserOperationStruct);

        const sig = await this.walletClient.signMessage(getBytes(userOpHash))

        userOp.signature = sig;

        // execute transaction
        const opTxHash = await this.ethClient.send("eth_sendUserOperation", [
            userOp,
            ENTRYPOINT_ADDRESS,
        ]);

        return {
            hash: opTxHash
        }
    }

    async sendUserOpBatch(tnxData: TnxData[], paymasterAndData?: string) {

        const AccountContrtact = new ContractFactory(ACCOUNT.abi, ACCOUNT.bytecode);
        const entryPoint = new Contract(ENTRYPOINT_ADDRESS, ENTRYPOINT_ABI, this.walletClient);
        const { address, initCode } = await this.account;

        const addresses:AddressLike[] = [];
        const datas:BytesLike[] = [];

        tnxData.forEach((t) => {
            addresses.push(t.to);
            datas.push(t.data || "0x");
        })

        const userOp: Partial<UserOperationStruct> = {
            sender: address, // smart account address
            nonce: "0x" + (await entryPoint.getNonce(address, 0)).toString(16),
            initCode,
            callData: AccountContrtact.interface.encodeFunctionData("executeBatch", [addresses, datas]),
            paymasterAndData: paymasterAndData || "0x",
            signature: getDummySignatureByTotalSignersLength(),
        };

        const { preVerificationGas, verificationGasLimit, callGasLimit } = await this.ethClient.send("eth_estimateUserOperationGas", [
            userOp,
            ENTRYPOINT_ADDRESS,
        ]);

        console.log("preVerificationGas", parseInt(preVerificationGas))
        console.log("verificationGasLimit", parseInt(verificationGasLimit))
        console.log("callGasLimit", parseInt(callGasLimit))

        // update userOp with relevant gas info 
        userOp.preVerificationGas = preVerificationGas;
        userOp.verificationGasLimit = verificationGasLimit;
        userOp.callGasLimit = callGasLimit;

        // get more relevant gas info and update userOp
        const { maxFeePerGas, maxPriorityFeePerGas } = await this.ethClient.send(
            "skandha_getGasPrice",
            []
        );
        console.log("maxFeePerGas", parseInt(maxFeePerGas!.toString()))
        console.log("maxPriorityFeePerGas", parseInt(maxPriorityFeePerGas))

        userOp.maxFeePerGas = parseInt(maxFeePerGas!.toString());
        userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

        // Sign userOp hash with account signer
        const userOpHash = await entryPoint.getUserOpHash(userOp as UserOperationStruct);

        const sig = await this.walletClient.signMessage(getBytes(userOpHash))

        userOp.signature = sig;

        // execute transaction
        const opTxHash = await this.ethClient.send("eth_sendUserOperation", [
            userOp,
            ENTRYPOINT_ADDRESS,
        ]);

        return {
            hash: opTxHash
        }
    }

    async getReceipt(hash:string) {
        const data = await this.ethClient.send("eth_getUserOperationReceipt", [
            hash
        ]);

        return data;
    }
}