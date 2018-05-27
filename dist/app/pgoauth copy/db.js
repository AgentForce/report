"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ORM = require("sequelize");
const dbUrl = 'postgres://oauth2:oauth2MNL@13.250.129.169:5432/oauth2';
const options = { benchmark: true, logging: console.log };
exports.sequelize = new ORM(dbUrl, options);
exports.sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
//# sourceMappingURL=db.js.map