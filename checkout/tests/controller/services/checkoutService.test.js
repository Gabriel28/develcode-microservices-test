import axios from 'axios';
import CheckoutService from '../../../src/services/checkoutService.js';

// Mock para o módulo axios
jest.mock('axios');

describe('CheckoutService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve realizar o request e retornar success', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    const response = await CheckoutService.processPayment('12345', '12133', 'VISA', 1000);
    expect(response.status).toBe('SUCCESS');
  });

  it('deve retornar cancelled quando o pagamento falhar', async () => {
    axios.post.mockResolvedValue({ data: { success: false } });
    const response = await CheckoutService.processPayment('12345', '12133', 'VISA', 1000);
    expect(response.status).toBe('CANCELLED');
  });

  it('deve retornar cancelled quando ocorrer um erro', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));
    const response = await CheckoutService.processPayment('12345', '12133', 'VISA', 1000);
    expect(response.status).toBe('CANCELLED');
  });
});
