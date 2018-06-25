"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client = require('node-rest-client').Client;
class TokenValidator {
    constructor() {
        this.checkToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.token !== undefined) {
                const client = new Client();
                let datapost = { name_api: 'post_releads' };
                const args = {
                    headers: {
                        'Authorization': 'Bearer ' + req.token,
                        'Content-Type': 'application/json'
                    },
                    data: datapost,
                    requestConfig: {
                        timeout: 10000,
                        noDelay: true,
                        keepAlive: true,
                        keepAliveDelay: 1000
                    },
                    responseConfig: {
                        timeout: 1000
                    }
                };
                const reqapi = client.post('http://13.250.129.169:3002/oauth/authorise/check', args, function (data, response) {
                    if (response.statusCode >= 200 && response.statusCode < 300) {
                        if (data.success === true) {
                            req['token'] = data.result.infor;
                            next();
                        }
                        else {
                            res.send(400, 'không có quyền');
                        }
                    }
                    else {
                        res.send(400, 'không có token ' + req.token);
                    }
                });
            }
            else
                res.send(400, 'không có token ' + req.token);
        });
    }
}
exports.TokenValidator = TokenValidator;
//# sourceMappingURL=tokenValidator.js.map