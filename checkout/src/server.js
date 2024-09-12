import express from 'express';
import routes from './routes/index.js';
import sequelize from './config/database.js';

const app = express();
routes(app);

const port = process.env.PORT || 3000;
sequelize.sync( {alter: true}).then(() => {
    console.log("Banco foi sincronizado com sucesso")
    app.listen(port, () => {
        console.log('Checkout Service na porta 3000');
    });
}).catch (err => {
    console.log("Erro ao sincronizar com o banco", err)
});

export default app
