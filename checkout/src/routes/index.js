import express from "express";
import checkoutRoutes from "./checkoutRoutes.js";

const app = express();
const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({title: "Hello"});
    })

    app.use(
        express.json(),
        checkoutRoutes
    );
}
export default routes;