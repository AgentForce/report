"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    constructor() {
        this.path = require('path');
        this.rootPath = this.path.normalize(__dirname + '/..');
        this.nodeEnv = process.env.NODE_ENV || 'development';
        this.nodeHost = process.env.NODE_HOST || '';
        this.nodePort = process.env.NODE_PORT || 4500;
        this.appName = process.env.APP_NAME || `manulife`;
        this.appVersion = process.env.APP_VERSION || '1.0.0';
        this.mongoConnect = process.env.MONGO_CONNECT || 'mongodb://manulife:manulife!!!@13.250.129.169:27017';
        this.logLevel = process.env.LOG_LEVEL || 'info';
        this.envSettings = {
            environment: this.nodeEnv,
            root: this.rootPath,
            app: {
                name: this.appName,
                host: this.nodeHost,
                port: this.nodePort,
                version: this.appVersion
            },
            db: {
                connection: this.mongoConnect
            },
            log: {
                level: this.logLevel
            }
        };
    }
}
exports.default = Config;
//# sourceMappingURL=config.js.map
