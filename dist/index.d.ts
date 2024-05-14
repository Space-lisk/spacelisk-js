import { Account } from "./account";
import { ContractData, ENV } from "./types/global.types";
export declare class AA {
    private apiKey;
    private signer;
    private env;
    rpcUrl: string;
    constructor(apiKey: string, signer: `0x${string}`, env?: ENV);
    account(salt?: string): Account;
}
export declare function encodeContractData(data: ContractData): {
    to: string;
    value: string;
    data: string;
};
