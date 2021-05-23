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
        while (_) try {
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
exports.__esModule = true;
var core = require("@actions/core");
var node_ssh_1 = require("node-ssh");
var path_1 = require("path");
var ssh2_streams_1 = require("ssh2-streams");
var fs_1 = require("fs");
var keyboard_1 = require("./keyboard");
var path_2 = require("path");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var host, username, port, privateKey, password, passphrase, tryKeyboard, verbose, recursive, concurrency, local, dotfiles, remote, rmRemote, atomicPut, exclude, originalFastPut_1, ssh, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = core.getInput('host') || 'localhost';
                    username = core.getInput('username');
                    port = +core.getInput('port') || 22;
                    privateKey = core.getInput('privateKey');
                    password = core.getInput('password');
                    passphrase = core.getInput('passphrase');
                    tryKeyboard = !!core.getInput('tryKeyboard');
                    verbose = !!core.getInput('verbose') || true;
                    recursive = !!core.getInput('recursive') || true;
                    concurrency = +core.getInput('concurrency') || 1;
                    local = core.getInput('local');
                    dotfiles = !!core.getInput('dotfiles') || true;
                    remote = core.getInput('remote');
                    rmRemote = !!core.getInput('rmRemote') || false;
                    atomicPut = core.getInput('atomicPut');
                    exclude = core.getInput('exclude') || null;
                    if (atomicPut) {
                        originalFastPut_1 = ssh2_streams_1.SFTPStream.prototype.fastPut;
                        ssh2_streams_1.SFTPStream.prototype.fastPut = function (localPath, remotePath, opts, cb) {
                            var parsedPath = path_2["default"].posix.parse(remotePath);
                            parsedPath.base = '.' + parsedPath.base;
                            var tmpRemotePath = path_2["default"].posix.format(parsedPath);
                            var that = this;
                            originalFastPut_1.apply(this, [
                                localPath,
                                tmpRemotePath,
                                opts,
                                function (error, result) {
                                    if (error) {
                                        cb(error, result);
                                    }
                                    else {
                                        that.ext_openssh_rename(tmpRemotePath, remotePath, cb);
                                    }
                                }
                            ]);
                        };
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, connect(host, username, port, privateKey, password, passphrase, tryKeyboard)];
                case 2:
                    ssh = _a.sent();
                    return [4 /*yield*/, scp(ssh, local, remote, dotfiles, concurrency, verbose, recursive, rmRemote, exclude)];
                case 3:
                    _a.sent();
                    ssh.dispose();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    core.setFailed(err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function connect(host, username, port, privateKey, password, passphrase, tryKeyboard) {
    if (host === void 0) { host = 'localhost'; }
    if (port === void 0) { port = 22; }
    return __awaiter(this, void 0, void 0, function () {
        var ssh, config, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ssh = new node_ssh_1.NodeSSH();
                    console.log("Establishing a SSH connection to " + host + ".");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    config = {
                        host: host,
                        port: port,
                        username: username,
                        password: password,
                        passphrase: passphrase,
                        tryKeyboard: tryKeyboard,
                        onKeyboardInteractive: tryKeyboard ? keyboard_1.keyboardFunction(password) : null
                    };
                    if (privateKey) {
                        console.log('using provided private key');
                        config.privateKey = privateKey;
                    }
                    return [4 /*yield*/, ssh.connect(config)];
                case 2:
                    _a.sent();
                    console.log("\uD83E\uDD1D Connected to " + host + ".");
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error("\u26A0\uFE0F The GitHub Action couldn't connect to " + host + ".", err_2);
                    core.setFailed(err_2.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, ssh];
            }
        });
    });
}
function scp(ssh, local, remote, dotfiles, concurrency, verbose, recursive, rmRemote, exclude) {
    if (dotfiles === void 0) { dotfiles = false; }
    if (verbose === void 0) { verbose = true; }
    if (recursive === void 0) { recursive = true; }
    if (rmRemote === void 0) { rmRemote = false; }
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting scp Action: " + local + " to " + remote);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    if (!isDirectory(local)) return [3 /*break*/, 5];
                    if (!rmRemote) return [3 /*break*/, 3];
                    return [4 /*yield*/, cleanDirectory(ssh, remote)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, putDirectory(ssh, local, remote, dotfiles, concurrency, verbose, recursive, exclude)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, putFile(ssh, local, remote, verbose)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    ssh.dispose();
                    console.log('✅ scp Action finished.');
                    return [3 /*break*/, 9];
                case 8:
                    err_3 = _a.sent();
                    console.error("\u26A0\uFE0F An error happened:(.", err_3.message, err_3.stack);
                    ssh.dispose();
                    process.abort();
                    core.setFailed(err_3.message);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function putDirectory(ssh, local, remote, dotfiles, concurrency, verbose, recursive, exclude) {
    if (dotfiles === void 0) { dotfiles = false; }
    if (concurrency === void 0) { concurrency = 3; }
    if (verbose === void 0) { verbose = false; }
    if (recursive === void 0) { recursive = true; }
    return __awaiter(this, void 0, void 0, function () {
        var exclude_r, failed, successful, status;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exclude_r = exclude ? new RegExp(parseExclude(exclude)) : null;
                    failed = [];
                    successful = [];
                    return [4 /*yield*/, ssh.putDirectory(local, remote, {
                            recursive: recursive,
                            concurrency: concurrency,
                            validate: function (path) {
                                return (!path_1["default"].basename(path).startsWith('.') || dotfiles) && (!exclude || !path.replace(new RegExp(local + '/?'), '').match(exclude_r));
                            },
                            tick: function (localPath, remotePath, error) {
                                if (error) {
                                    if (verbose) {
                                        console.log("\u2755copy failed for " + localPath + ".");
                                    }
                                    failed.push({ local: localPath, remote: remotePath });
                                }
                                else {
                                    if (verbose) {
                                        console.log("\u2714 successfully copied " + localPath + ".");
                                    }
                                    successful.push({ local: localPath, remote: remotePath });
                                }
                            }
                        })];
                case 1:
                    status = _a.sent();
                    console.log("The copy of directory " + local + " was " + (status ? 'successful' : 'unsuccessful') + ".");
                    if (!(failed.length > 0)) return [3 /*break*/, 3];
                    console.log('failed transfers', failed.join(', '));
                    return [4 /*yield*/, putMany(failed, function (failed) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("Retrying to copy " + failed.local + " to " + failed.remote + ".");
                                        return [4 /*yield*/, putFile(ssh, failed.local, failed.remote, true)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function cleanDirectory(ssh, remote, verbose) {
    if (verbose === void 0) { verbose = true; }
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ssh.execCommand("rm -rf " + remote + "/*")];
                case 1:
                    _a.sent();
                    if (verbose) {
                        console.log("\u2714 Successfully deleted all files of " + remote + ".");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("\u26A0\uFE0F An error happened:(.", error_1.message, error_1.stack);
                    ssh.dispose();
                    core.setFailed(error_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function putFile(ssh, local, remote, verbose) {
    if (verbose === void 0) { verbose = true; }
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ssh.putFile(local, remote)];
                case 1:
                    _a.sent();
                    if (verbose) {
                        console.log("\u2714 Successfully copied file " + local + " to remote " + remote + ".");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("\u26A0\uFE0F An error happened:(.", error_2.message, error_2.stack);
                    ssh.dispose();
                    core.setFailed(error_2.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function isDirectory(path) {
    return fs_1["default"].existsSync(path) && fs_1["default"].lstatSync(path).isDirectory();
}
function putMany(array, asyncFunction) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, array_1, el;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, array_1 = array;
                    _a.label = 1;
                case 1:
                    if (!(_i < array_1.length)) return [3 /*break*/, 4];
                    el = array_1[_i];
                    return [4 /*yield*/, asyncFunction(el)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function parseExclude(path) {
    var res = path;
    res = res.replace(/\./g, '\\.');
    res = res.replace(/\*/g, '.*');
    res = '^' + res + '$';
    console.log(res);
    return res;
}
process.on('uncaughtException', function (err) {
    if (err['code'] !== 'ECONNRESET')
        throw err;
});
run();
