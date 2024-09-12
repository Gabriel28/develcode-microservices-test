import axios from 'axios';

const PAYMENT_GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL || 'http://payment-gateway:8082/payment';

class CheckoutService {
    static processPayment = async (orderId, amount) => {
        const paymentRequest = {
            orderId: orderId,
            amount: amount
        };

        try {
            const response = await axios.post(PAYMENT_GATEWAY_URL, paymentRequest);
            return response.data.success ? { status: 'SUCCESS' } : { status: 'CANCELLED' }
        } catch (error) {
            return { status: 'CANCELLED' };
        }
    }
}

export default CheckoutService;