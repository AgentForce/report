"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const ORM = require("sequelize");
exports.Contract_Product = db_1.sequelize.define('manulife_contract_products', {
    LeadId: {
        type: ORM.INTEGER,
        primaryKey: true
    },
    ProductName: ORM.STRING
}, {
    timestamps: false
});
//# sourceMappingURL=User.js.map