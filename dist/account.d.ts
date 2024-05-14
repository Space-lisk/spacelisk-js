import { ENV, TnxData } from "./types/global.types";
export declare class Account {
    private apiKey;
    private env;
    private account;
    private ethClient;
    private walletClient;
    constructor(apiKey: string, signer: `0x${string}`, env: ENV, salt: string);
    private initializeAccount;
    getAddress(): Promise<string>;
    sendUserOp(tnxData: TnxData, paymasterAndData?: string): Promise<{
        hash: any;
    }>;
    sendUserOpBatch(tnxData: TnxData[], paymasterAndData?: string): Promise<{
        hash: any;
    }>;
    getReceipt(hash: string): Promise<any>;
}
