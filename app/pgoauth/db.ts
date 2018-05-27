
import * as ORM from 'sequelize';
import { Sequelize, LoggingOptions } from 'sequelize';

const dbUrl: string = 'postgres://oauth2:oauth2MNL@13.250.129.169:5432/oauth2';
const options: LoggingOptions = { benchmark: true, logging: console.log };
export const sequelizeOauth: Sequelize = new ORM(dbUrl, options);

sequelizeOauth.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});