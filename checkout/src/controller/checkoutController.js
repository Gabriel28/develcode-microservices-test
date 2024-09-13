import { v4 as uuidv4 } from 'uuid';
import Order from "../model/Order.js";
import CheckoutService from "../services/checkoutService.js";

class CheckoutController {

    static test = (req, res) => {
        res.status(200).json(Date.now());
    }

    static createPaymentOrder = async (req, res) => {
        try {
            const { card, amount } = req.body;

            if (!amount) {
                return res.status(400).json({ message_error: "Amount é um campo requerido, tente novamente." });
            }

            const paymentId = uuidv4();
            const order = await Order.create({ amount, paymentId, card, status: 'PENDING' });
            const response = await CheckoutService.processPayment(order.orderId, paymentId, card, amount);

            console.log(response.status); // Apenas para consultar log no docker
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
            console.error('Erro no processamento do pedido, tente novamente.', err); //  Apenas para consultar log no docker
            return res.status(500).json({ error: 'Erro ao processar o pedido, tente novamente.' });
        }
    }
}

export default CheckoutController;
