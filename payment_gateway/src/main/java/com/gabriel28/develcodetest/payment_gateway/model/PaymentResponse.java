package com.gabriel28.develcodetest.payment_gateway.model;

public class PaymentResponse {

    private boolean success;

    public PaymentResponse(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
