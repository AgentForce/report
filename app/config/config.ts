export default class Config {

    private path = require('path');
    private rootPath = this.path.normalize(__dirname + '/..');

    private nodeEnv = process.env.NODE_ENV || 'development';
    private nodeHost = process.env.NODE_HOST || '';
    private nodePort = process.env.NODE_PORT || 4500;

    private appName = process.env.APP_NAME || `manulife`;
    private appVersion = process.env.APP_VERSION || '1.0.0';

    private mongoConnect = process.env.MONGO_CONNECT || 'mongodb://manulife:manulife!!!@13.250.129.169:27017';
    private logLevel = process.env.LOG_LEVEL || 'info';

    public envSettings = {
        environment: this.nodeEnv,
        root: this.rootPath,
        app: {
            name: this.appName, // + '-' + this.nodeEnv,
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