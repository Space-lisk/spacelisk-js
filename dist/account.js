"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
var ethers_1 = require("ethers");
var constants_1 = require("./utils/constants");
var EntryPoint_json_1 = require("../artifacts/EntryPoint.json");
var SimpleAccount_json_1 = __importDefault(require("../artifacts/SimpleAccount.json"));
var abis_1 = require("./utils/abis");
var helpers_1 = require("./utils/helpers");
var Account = /** @class */ (function () {
    function Account(apiKey, signer, env, salt) {
        this.apiKey = apiKey;
        this.env = env;
        this.ethClient = new ethers_1.JsonRpcProvider("".concat((0, helpers_1.getRpcUrl)(this.env)).concat(this.apiKey));
        this.walletClient = new ethers_1.BaseWallet(new ethers_1.SigningKey(signer), this.ethClient);
        this.account = this.initializeAccount(salt);
    }
    Account.prototype.initializeAccount = function (salt) {
        return __awaiter(this, void 0, void 0, function () {
            var entryPoint, factory, initCode, _a, _b, _c, _d, address, ex_1, code;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        entryPoint = new ethers_1.Contract(constants_1.ENTRYPOINT_ADDRESS, EntryPoint_json_1.abi, this.walletClient);
                        factory = new ethers_1.Contract(constants_1.FACTORY_ADDRESS, abis_1.FactoryAbi);
                        _a = constants_1.FACTORY_ADDRESS;
                        _c = (_b = factory.interface).encodeFunctionData;
                        _d = ["createAccount"];
                        return [4 /*yield*/, this.walletClient.getAddress()];
                    case 1:
                        initCode = _a + _c.apply(_b, _d.concat([[_e.sent(), salt]])).slice(2);
                        address = "";
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, entryPoint.getSenderAddress(initCode)];
                    case 3:
                        _e.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        ex_1 = _e.sent();
                        address = "0x" + ex_1.data.slice(-40);
                        return [3 /*break*/, 5];
                    case 5: return [4 /*yield*/, this.ethClient.getCode(address)];
                    case 6:
                        code = _e.sent();
                        if (code !== "0x") {
                            initCode = "0x";
                        }
                        return [2 /*return*/, { address: address, initCode: initCode }];
                }
            });
        });
    };
    Account.prototype.getAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.account];
                    case 1: return [2 /*return*/, (_a.sent()).address];
                }
            });
        });
    };
    Account.prototype.sendUserOp = function (tnxData, paymasterAndData) {
        return __awaiter(this, void 0, void 0, function () {
            var AccountContrtact, entryPoint, _a, address, initCode, userOp, _b, _c, preVerificationGas, verificationGasLimit, callGasLimit, _d, maxFeePerGas, maxPriorityFeePerGas, userOpHash, sig, opTxHash;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        AccountContrtact = new ethers_1.ContractFactory(SimpleAccount_json_1.default.abi, SimpleAccount_json_1.default.bytecode);
                        entryPoint = new ethers_1.Contract(constants_1.ENTRYPOINT_ADDRESS, EntryPoint_json_1.abi, this.walletClient);
                        return [4 /*yield*/, this.account];
                    case 1:
                        _a = _f.sent(), address = _a.address, initCode = _a.initCode;
                        _e = {
                            sender: address
                        };
                        _b = "0x";
                        return [4 /*yield*/, entryPoint.getNonce(address, 0)];
                    case 2:
                        userOp = (_e.nonce = _b + (_f.sent()).toString(16),
                            _e.initCode = initCode,
                            _e.callData = AccountContrtact.interface.encodeFunctionData("execute", [tnxData.to, tnxData.value, tnxData.data || "0x"]),
                            _e.paymasterAndData = paymasterAndData || "0x",
                            _e.signature = (0, helpers_1.getDummySignatureByTotalSignersLength)(),
                            _e);
                        return [4 /*yield*/, this.ethClient.send("eth_estimateUserOperationGas", [
                                userOp,
                                constants_1.ENTRYPOINT_ADDRESS,
                            ])];
                    case 3:
                        _c = _f.sent(), preVerificationGas = _c.preVerificationGas, verificationGasLimit = _c.verificationGasLimit, callGasLimit = _c.callGasLimit;
                        console.log("preVerificationGas", parseInt(preVerificationGas));
                        console.log("verificationGasLimit", parseInt(verificationGasLimit));
                        console.log("callGasLimit", parseInt(callGasLimit));
                        // update userOp with relevant gas info 
                        userOp.preVerificationGas = preVerificationGas;
                        userOp.verificationGasLimit = verificationGasLimit;
                        userOp.callGasLimit = callGasLimit;
                        return [4 /*yield*/, this.ethClient.send("skandha_getGasPrice", [])];
                    case 4:
                        _d = _f.sent(), maxFeePerGas = _d.maxFeePerGas, maxPriorityFeePerGas = _d.maxPriorityFeePerGas;
                        console.log("maxFeePerGas", parseInt(maxFeePerGas.toString()));
                        console.log("maxPriorityFeePerGas", parseInt(maxPriorityFeePerGas));
                        userOp.maxFeePerGas = parseInt(maxFeePerGas.toString());
                        userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;
                        return [4 /*yield*/, entryPoint.getUserOpHash(userOp)];
                    case 5:
                        userOpHash = _f.sent();
                        return [4 /*yield*/, this.walletClient.signMessage((0, ethers_1.getBytes)(userOpHash))];
                    case 6:
                        sig = _f.sent();
                        userOp.signature = sig;
                        return [4 /*yield*/, this.ethClient.send("eth_sendUserOperation", [
                                userOp,
                                constants_1.ENTRYPOINT_ADDRESS,
                            ])];
                    case 7:
                        opTxHash = _f.sent();
                        return [2 /*return*/, {
                                hash: opTxHash
                            }];
                }
            });
        });
    };
    Account.prototype.sendUserOpBatch = function (tnxData, paymasterAndData) {
        return __awaiter(this, void 0, void 0, function () {
            var AccountContrtact, entryPoint, _a, address, initCode, addresses, datas, userOp, _b, _c, preVerificationGas, verificationGasLimit, callGasLimit, _d, maxFeePerGas, maxPriorityFeePerGas, userOpHash, sig, opTxHash;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        AccountContrtact = new ethers_1.ContractFactory(SimpleAccount_json_1.default.abi, SimpleAccount_json_1.default.bytecode);
                        entryPoint = new ethers_1.Contract(constants_1.ENTRYPOINT_ADDRESS, EntryPoint_json_1.abi, this.walletClient);
                        return [4 /*yield*/, this.account];
                    case 1:
                        _a = _f.sent(), address = _a.address, initCode = _a.initCode;
                        addresses = [];
                        datas = [];
                        tnxData.forEach(function (t) {
                            addresses.push(t.to);
                            datas.push(t.data || "0x");
                        });
                        _e = {
                            sender: address
                        };
                        _b = "0x";
                        return [4 /*yield*/, entryPoint.getNonce(address, 0)];
                    case 2:
                        userOp = (_e.nonce = _b + (_f.sent()).toString(16),
                            _e.initCode = initCode,
                            _e.callData = AccountContrtact.interface.encodeFunctionData("executeBatch", [addresses, datas]),
                            _e.paymasterAndData = paymasterAndData || "0x",
                            _e.signature = (0, helpers_1.getDummySignatureByTotalSignersLength)(),
                            _e);
                        return [4 /*yield*/, this.ethClient.send("eth_estimateUserOperationGas", [
                                userOp,
                                constants_1.ENTRYPOINT_ADDRESS,
                            ])];
                    case 3:
                        _c = _f.sent(), preVerificationGas = _c.preVerificationGas, verificationGasLimit = _c.verificationGasLimit, callGasLimit = _c.callGasLimit;
                        console.log("preVerificationGas", parseInt(preVerificationGas));
                        console.log("verificationGasLimit", parseInt(verificationGasLimit));
                        console.log("callGasLimit", parseInt(callGasLimit));
                        // update userOp with relevant gas info 
                        userOp.preVerificationGas = preVerificationGas;
                        userOp.verificationGasLimit = verificationGasLimit;
                        userOp.callGasLimit = callGasLimit;
                        return [4 /*yield*/, this.ethClient.send("skandha_getGasPrice", [])];
                    case 4:
                        _d = _f.sent(), maxFeePerGas = _d.maxFeePerGas, maxPriorityFeePerGas = _d.maxPriorityFeePerGas;
                        console.log("maxFeePerGas", parseInt(maxFeePerGas.toString()));
                        console.log("maxPriorityFeePerGas", parseInt(maxPriorityFeePerGas));
                        userOp.maxFeePerGas = parseInt(maxFeePerGas.toString());
                        userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;
                        return [4 /*yield*/, entryPoint.getUserOpHash(userOp)];
                    case 5:
                        userOpHash = _f.sent();
                        return [4 /*yield*/, this.walletClient.signMessage((0, ethers_1.getBytes)(userOpHash))];
                    case 6:
                        sig = _f.sent();
                        userOp.signature = sig;
                        return [4 /*yield*/, this.ethClient.send("eth_sendUserOperation", [
                                userOp,
                                constants_1.ENTRYPOINT_ADDRESS,
                            ])];
                    case 7:
                        opTxHash = _f.sent();
                        return [2 /*return*/, {
                                hash: opTxHash
                            }];
                }
            });
        });
    };
    Account.prototype.getReceipt = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ethClient.send("eth_getUserOperationReceipt", [
                            hash
                        ])];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    return Account;
}());
exports.Account = Account;
