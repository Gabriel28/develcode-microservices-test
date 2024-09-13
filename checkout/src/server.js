import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import sequelize from './config/database.js';
dotenv.config();

const app = express();
routes(app);

sequelize.sync( {force: true, alter: true}).then(() => {
    console.log("Banco foi sincronizado com sucesso")
    app.listen(process.env.PORT, () => {
        console.log('Checkout Service na porta 3000');
    });
}).catch (err => {
    console.log("Erro ao sincronizar com o banco", err)
});

export default app
