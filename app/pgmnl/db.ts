
import * as ORM from 'sequelize';
import { Sequelize, LoggingOptions } from 'sequelize';

const dbUrl: string = 'postgres://manulife:manulifePsql@13.250.129.169:5432/manulife';
const options: LoggingOptions = { benchmark: true, logging: console.log };
export const sequelize: Sequelize = new ORM(dbUrl, options);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});