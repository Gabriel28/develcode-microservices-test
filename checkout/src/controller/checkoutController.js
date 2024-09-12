import Order from "../model/Order.js";
import CheckoutService from "../services/checkoutService.js";

class CheckoutController {
    
    static test = (req, res) => {
        res.status(200).send("checkout no checkout");
    }

    static createPaymentOrder = async (req, res) => {
        try {
            const { amount } = req.body;
            if (!amount) {
                return res.status(400).json({ message_error: "Amount é um campo requerido, tente novamente." });
            }
            const order = await Order.create({ amount, status: 'PENDING' });
            const response = await CheckoutService.processPayment(order.orderId, amount);

            order.status = response.status;
            await order.save();
            
            
            if (order.status === 'CANCELLED') {
                return res.status(400).json({ message: 'Pedido cancelado devido a falha no pagamento' });
            }

            res.status(200).json(order);
        } catch (err) {
            console.error('Erro no processamento do pedido', error);
            return res.status(500).json({ error: 'Erro ao processar o pedido' });
        }
    }
}

export default CheckoutController;
