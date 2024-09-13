import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PAYMENT_GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL
class CheckoutService {
    static processPayment = async (orderId, paymentId, card, amount) => {
        const paymentRequest = {
            orderId: orderId,
            paymentId: paymentId,
            card: card,
            amount: amount
        };

        try {
            const response = await axios.post(PAYMENT_GATEWAY_URL, paymentRequest);
            console.log(response.data)
            return response.data.success ? { status: 'SUCCESS' } : { status: 'CANCELLED' }
        } catch (error) {
            return { status: 'CANCELLED' };
        }
    }
}

export default CheckoutService;