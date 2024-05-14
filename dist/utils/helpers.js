"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDummySignatureByTotalSignersLength = exports.getRpcUrl = void 0;
var constants_1 = require("./constants");
function getRpcUrl(env) {
    switch (env) {
        case "sepolia":
            return constants_1.LISK_AA_SEPOLIA_RPC_URL;
            break;
        default:
            return constants_1.LISK_AA_SEPOLIA_RPC_URL;
            break;
    }
}
exports.getRpcUrl = getRpcUrl;
function getDummySignatureByTotalSignersLength(signers_length) {
    if (signers_length === void 0) { signers_length = 1; }
    var _sig = "0x";
    for (var index = 0; index < signers_length; index++) {
        _sig += "fffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
    }
    return _sig;
}
exports.getDummySignatureByTotalSignersLength = getDummySignatureByTotalSignersLength;
;
