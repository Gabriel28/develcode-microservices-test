# Teste BackEnd - DevelCode

O objetivo do teste é criar dois microservices para um sistema simulando um pedido de compra.
O fluxo deve ser capaz de cancelar um pedido automaticamente caso o pagamento falhe. 

> *Deve ser realizado um microservice em Java e o outro em Node.JS*

<img src="/resources/fluxo-story.svg" alt="fluxo-storytelling">

# Microservices 

## Checkout - Node.JS
O checkout será o responsável por realizar a criação dos pedidos e enviar as solicitações ao payment gateway.

## Payment Gateway - Java
Processa as solicitações de pagamento e simula o sucesso ou falha do pagamento.

## Banco de dados
Para essa tarefa irei utilizar o banco MySQL. 

# Instruções de uso

Primero, você deve realizar o clone do projeto

```https://github.com/Gabriel28/develcode-microservices-test.git```

Após o clone, dentro do diretório ``checkout`` você deve criar um arquivo .env, seguindo o exemplo do .env.exemple

> *Como no teste em si não trabalhamos com informação sensível, eu deixei o arquivo com as informações, basta copiar e colar*

Criado o .env, você deve voltar a raíz ``cd ..`` executar o arquivo ``docker-compose.yml``, ele irá subir os serviços de payment_gateway, o checkout e irá criar o nosso banco. 

### Linux
```
sudo docker-compose up --build
```
Ou você pode utilizar o modo *root*
```
sudo su -
docker-compose up --build
```

### No Windows
```
docker-compose up --build
```

## Checkout

O checkout vai estar sendo executado na porta 3000 (ou na de sua preferência no .env) - ``localhost:3000/api/checkout/payment-order``

Todo pedido iniciado entra no banco como `PENDING` por default. Por isso os únicos campos que serão enviados no request body são `amount` e `card`.

``
curl --location 'localhost:3000/api/checkout/payment-order' \
--header 'Content-Type: application/json' \
--data '{
    "card": "AMEX",
    "amount": "45600.08"
}'

``
![alt text](image.png)

Card será utilizado para realizar algumas simulações de caso de uso, por exemplo: 

- AMEX sempre será aprovado independente do valor
- MASTERCARD, VISA E ELO, podem enviar solicitações até 50000, porém ainda sim existe uma chance de que o pagamento falhe
- Qualquer outro cartão ou opção inválida ele retornará ``false``;

Response 200 OK: 

```
{
    "message": "Pagamento realizado com sucesso, acompanhe utilizando este código: d4bbe67f-c582-4bc0-8183-c550d535df51",
    "order": {
        "orderId": 5,
        "amount": "45600.08",
        "paymentId": "d4bbe67f-c582-4bc0-8183-c550d535df51",
        "card": "AMEX",
        "status": "SUCCESS",
        "updatedAt": "2024-09-13T05:58:45.015Z",
        "createdAt": "2024-09-13T05:58:45.000Z"
    }
}
```
Response 400 - Bad Request, neste caso o pagamento foi negado.
```
{
    "message": "Pedido cancelado devido a falha no pagamento"
}

```
Neste caso o pedido foi cancelado


<img src="/resources/registersql.png" alt="sql-register">

## Payment Gateway

Realiza a validação e simulação de cada pedido de pagamento retornando `{"success": true} ou {"success": false}` para o checkout. 
O Payment Gateway vai estar sendo executado na porta 8082 (definida no application.properties)

- Local: ``localhost:8082/payment``
- Container: ``http://payment-gateway:8082/payment``

Ele recebe o mesmo body do checkout, isso porque nos vamos precisar das informações para nossa simulação de aprovação. 

```
curl --location 'localhost:8082/payment' \
--header 'Content-Type: application/json' \
--data '{
    "card": "ELO",
    "amount": "322.08"
}'
```

Dentro do nosso PaymentController.java realizamos a simulação com um ``Random()`` para cartões *VISA, ELO e MASTERCARD*.

```
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
```
## TESTS


### Para o Checkout (dentro do seu diretório): 

<img src="/resources/Tests_and_coverage.png" alt="test-checkout">


```
npm run test
```

### Para o Payment:

<img src="/resources/test_payment.png" alt="test-checkout">


```
mvn test
``` 
