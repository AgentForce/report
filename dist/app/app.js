"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const restify = require("restify");
const bluebird = require("bluebird");
const mongoose = require("mongoose");
const corsMiddleware = require("restify-cors-middleware");
const config_1 = require("./config/config");
const logger_1 = require("./services/logger");
const bearerToken = require('express-bearer-token');
const config = new config_1.default();
const envSettings = config.envSettings;
exports.server = restify.createServer({
    name: envSettings.app.name,
    version: envSettings.app.version
});
const cors = corsMiddleware({
    preflightMaxAge: 50,
    origins: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowHeaders: ['*'],
    exposeHeaders: ['API-Token-Expiry']
});
exports.server.pre(cors.preflight);
exports.server.use(cors.actual);
exports.server.pre(restify.pre.sanitizePath());
exports.server.use(restify.plugins.jsonBodyParser({ mapParams: true }));
exports.server.use(restify.plugins.acceptParser(exports.server.acceptable));
exports.server.use(restify.plugins.queryParser({ mapParams: true }));
exports.server.use(restify.plugins.fullResponse());
exports.server.use(restify.plugins.authorizationParser());
exports.server.use(bearerToken());
exports.server.listen(envSettings.app.port, envSettings.app.host, () => {
    logger_1.logger.info(`INFO: Node app ${envSettings.app.name} is running at ${exports.server.url}`);
    const options = { useMongoClient: true, promiseLibrary: bluebird };
    const dbUri = `${envSettings.db.connection}/${envSettings.app.name}`;
    mongoose.Promise = bluebird;
    mongoose.connect(dbUri, options);
    const db = mongoose.connection;
    db.on('error', (err) => {
        console.error(err);
        process.exit(1);
    });
    db.once('open', () => {
        logger_1.logger.info(`INFO: MongoDB database ${envSettings.app.name} is running at ${envSettings.db.connection}`);
        fs.readdirSync(__dirname + '/routes').forEach((routeConfig) => {
            if (routeConfig.substr(-3) === '.js' && routeConfig !== 'index.js') {
                const route = require(__dirname + '/routes/' + routeConfig);
                route.routes(exports.server);
            }
        });
    });
});
//# sourceMappingURL=app.js.map