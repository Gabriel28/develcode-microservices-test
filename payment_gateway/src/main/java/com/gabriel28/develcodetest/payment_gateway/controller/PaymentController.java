package com.gabriel28.develcodetest.payment_gateway.controller;

import com.gabriel28.develcodetest.payment_gateway.model.PaymentRequest;
import com.gabriel28.develcodetest.payment_gateway.model.PaymentResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping(value = "/payment", produces = MediaType.APPLICATION_JSON_VALUE)
public class PaymentController {

    @PostMapping
    public PaymentResponse processPayment(@RequestBody PaymentRequest request) {
        Double amount = request.getAmount();
        String card = request.getCard();

        boolean success = switch (card.toUpperCase()) {
            case "VISA", "MASTERCARD", "ELO" -> amount < 50000 && new Random().nextBoolean();
            case "AMEX" -> true;
            default -> false;
        };

        // Apenas para verificar execução no docker
        System.out.println("Cartão: " + card + ", Valor: " + amount + ", Sucesso: " + success);

        return new PaymentResponse(success);
    }
}
