import { ENV } from "../types/global.types";
import { LISK_AA_SEPOLIA_RPC_URL } from "./constants";

export function getRpcUrl(env:ENV) {
    switch (env) {
        case "sepolia":
            return LISK_AA_SEPOLIA_RPC_URL;
            break;
    
        default:
            return LISK_AA_SEPOLIA_RPC_URL;
            break;
    }
}

export function getDummySignatureByTotalSignersLength(signers_length: number = 1) {
    let _sig = "0x"
    for (let index = 0; index < signers_length; index++) {
        _sig += "fffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c"
    }
    return _sig
};