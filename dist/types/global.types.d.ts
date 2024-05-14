import { BigNumberish, BytesLike, AddressLike } from "ethers";
export type ENV = "sepolia";
export type UserOperationStruct = {
    sender: AddressLike;
    nonce: BigNumberish;
    initCode: BytesLike;
    callData: BytesLike;
    callGasLimit: BigNumberish;
    verificationGasLimit: BigNumberish;
    preVerificationGas: BigNumberish;
    maxFeePerGas: BigNumberish;
    maxPriorityFeePerGas: BigNumberish;
    paymasterAndData: BytesLike;
    signature: BytesLike;
};
export interface TnxData {
    to: AddressLike;
    value: BigNumberish | BigInt;
    data?: string | BytesLike;
}
export interface ContractData {
    address: string;
    abi: any[];
    functionName: string;
    args: any[];
    value?: string;
}
