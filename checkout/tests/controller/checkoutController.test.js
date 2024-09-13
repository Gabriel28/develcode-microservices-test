import request from 'supertest';
import express from 'express';
import CheckoutController from '../../src/controller/checkoutController.js';
import Order from '../../src/model/Order.js';
import CheckoutService from '../../src/services/checkoutService.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());
app.post('/createPaymentOrder', CheckoutController.createPaymentOrder);

// Mock do modelo e do serviço
jest.mock('../../src/model/Order.js');
jest.mock('../../src/services/checkoutService.js');

describe('CheckoutController', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('deve criar uma ordem de pagamento e retornar success', async () => {
        Order.create.mockResolvedValue({
            orderId: '123',
            paymentId: uuidv4,
            amount: 1000,
            card: 'VISA',
            status: 'PENDING',
            save: jest.fn().mockResolvedValue({ status: 'SUCCESS' })
        });

        CheckoutService.processPayment.mockResolvedValue({ status: 'SUCCESS' });

        const response = await request(app)
            .post('/createPaymentOrder')
            .send({ card: 'VISA', amount: 1000 });

        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/Pagamento realizado com sucesso/);
    });

    it('deve controlar o erro, retornar uma mensagem e deve mudar o status para cancelado', async () => {
        Order.create.mockResolvedValue({
            orderId: '123',
            paymentId: uuidv4,
            amount: 1000,
            card: 'VISA',
            status: 'PENDING',
            save: jest.fn().mockResolvedValue({ status: 'CANCELLED' })
        });

        CheckoutService.processPayment.mockResolvedValue({ status: 'CANCELLED' });

        const response = await request(app)
            .post('/createPaymentOrder')
            .send({ card: 'VISA', amount: 1000 });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/Pedido cancelado devido a falha no pagamento/);
    });

    it('deve retornar erro 500 quando o serviço lançar uma exceção', async () => {
        Order.create.mockResolvedValue({
            orderId: '123',
            amount: 1000,
            card: 'VISA',
            status: 'PENDING',
            save: jest.fn().mockResolvedValue({ status: 'PENDING' })
        });

        CheckoutService.processPayment.mockRejectedValue(new Error('Internal Server Error'));

        const response = await request(app)
            .post('/createPaymentOrder')
            .send({ card: 'VISA', amount: 1000 });

        expect(response.status).toBe(500);
        expect(response.body.message).toMatch(/Erro ao processar o pedido, tente novamente/);
    });

    it('deve apresentar erro quando a request não tiver o campo "amount"', async () => {
        const response = await request(app)
            .post('/createPaymentOrder')
            .send({ card: 'VISA' });

        expect(response.status).toBe(400);
        expect(response.body.message_error).toMatch(/Amount é um campo requerido/);
    });
});
