"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const ORM = require("sequelize");
exports.User = db_1.sequelize.define('oauth_user', {
    username: ORM.STRING,
    password: ORM.STRING,
    phone: ORM.STRING,
    address: ORM.STRING,
    city: ORM.INTEGER,
    district: ORM.INTEGER,
    gender: ORM.INTEGER,
    birthday: ORM.DATE,
    level: ORM.INTEGER,
    status: ORM.INTEGER,
    lastlogin: ORM.DATE,
    expirence: ORM.DATE,
    fullName: ORM.STRING,
    email: ORM.STRING,
    scope: ORM.STRING,
    resource_ids: ORM.STRING,
    zone: ORM.INTEGER,
    createdAt: ORM.DATE,
    code_level: ORM.STRING,
    badge: ORM.STRING,
    updatedAt: ORM.DATE,
    report_to: ORM.STRING,
    report_to_list: ORM.STRING,
    report_to_username: ORM.STRING
});
//# sourceMappingURL=User.js.map