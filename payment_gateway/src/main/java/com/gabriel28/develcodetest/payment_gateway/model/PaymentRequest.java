package com.gabriel28.develcodetest.payment_gateway.model;

public class PaymentRequest {

    private Double amount;
    private String card;

    public PaymentRequest() {
    }

    // Construtor com parâmetros enviados do checkout
    public PaymentRequest(Double amount, String card) {
        this.amount = amount;
        this.card = card;
    }

    // Getter e setter
    public Double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCard() {
        return card;
    }

    public void setCard(String card) {
        this.card = card;
    }
}
