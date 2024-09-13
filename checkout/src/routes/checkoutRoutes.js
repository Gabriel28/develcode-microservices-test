import express from "express";
import CheckoutController from "../controller/checkoutController.js";

const router = express.Router();

/*
    POST
*/
router.post("/api/checkout/payment-order", CheckoutController.createPaymentOrder)

export default router;
