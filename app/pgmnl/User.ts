
import { sequelize } from './db';
import * as ORM from 'sequelize';

export const Contract_Product = sequelize.define('manulife_contract_products', {
    LeadId: {
        type: ORM.INTEGER,
        primaryKey: true
    },
    ProductName: ORM.STRING
}, {
    timestamps: false
});