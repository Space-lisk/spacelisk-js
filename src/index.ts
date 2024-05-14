import { Contract } from "ethers";
import { Account } from "./account";
import { ContractData, ENV } from "./types/global.types";
import { getRpcUrl } from "./utils/helpers";

export class AA {
    private apiKey: string;
    private signer: `0x${string}`;
    private env: ENV;
    public rpcUrl: string;

    constructor(apiKey: string, signer: `0x${string}`, env: ENV = "sepolia") {
        this.apiKey = apiKey;
        this.signer = signer;
        this.env = env;
        this.rpcUrl = getRpcUrl(env);
    }

    account(salt: string = "0") {
        return new Account(this.apiKey, this.signer, this.env, salt);
    }

}

export function encodeContractData(data: ContractData) {    
    try {
        const contract = new Contract(data.address, data.abi);
        const callData = contract.interface.encodeFunctionData(data.functionName, data.args);
        return {
            to: data.address,
            value: data.value || "0x",
            data: callData
        }
    } catch (error) {
        throw new Error((error as any));
    }
}