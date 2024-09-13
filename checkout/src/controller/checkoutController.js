import { v4 as uuidv4 } from 'uuid';
import Order from "../model/Order.js";
import CheckoutService from "../services/checkoutService.js";

class CheckoutController {
    static createPaymentOrder = async (req, res) => {
        try {
            const { card, amount } = req.body;

            if (!amount) {
                return res.status(400).json({ message_error: "Amount é um campo requerido, tente novamente." });
            }

            const paymentId = uuidv4();
            const order = await Order.create({ amount, paymentId, card, status: 'PENDING' });
            const response = await CheckoutService.processPayment(order.orderId, paymentId, card, amount);
            order.status = response.status;
            await order.save();

            if (order.status === 'CANCELLED') {
                return res.status(400).json({ message: 'Pedido cancelado devido a falha no pagamento' });
            }

            // UUID apenas para caracterizar um id de pagamento. 
            res.status(200).json({
                message: `Pagamento realizado com sucesso, acompanhe utilizando este código: ${paymentId}`,
                order
            });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao processar o pedido, tente novamente.' });
        }
    }
}

export default CheckoutController;
