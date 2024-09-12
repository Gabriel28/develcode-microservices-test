import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('checkout', 'root', 'secret', {
    host: 'db',
    dialect: 'mysql'
});

export default sequelize;
