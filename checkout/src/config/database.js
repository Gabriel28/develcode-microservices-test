import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE, 
    'root',
    process.env.MYSQL_ROOT_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
});

export default sequelize;
