package com.gabriel28.develcodetest.payment_gateway.controller;

import com.gabriel28.develcodetest.payment_gateway.model.PaymentRequest;
import com.gabriel28.develcodetest.payment_gateway.model.PaymentResponse;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PaymentControllerTest {

    private final PaymentController paymentController = new PaymentController();

    @Test
    public void testPaymentSuccess() {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setAmount(5990.0);
        paymentRequest.setCard("AMEX");

        PaymentResponse paymentResponse = paymentController.processPayment(paymentRequest);

        assertTrue(paymentResponse.isSuccess());
    }
    @Test
    public void testPaymentNotSuccess() {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setAmount(10.000);
        paymentRequest.setCard("DINNERS");

        PaymentResponse paymentResponse = paymentController.processPayment(paymentRequest);

        assertFalse(paymentResponse.isSuccess());
    }

    @Test
    public void testVisaCardWithAmountGraterThan50() {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setAmount(51000);
        paymentRequest.setCard("VISA");
        PaymentResponse paymentResponse = paymentController.processPayment(paymentRequest);

        assertFalse(paymentResponse.isSuccess());
    }
}
