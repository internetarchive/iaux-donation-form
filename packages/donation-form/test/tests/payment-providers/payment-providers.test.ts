import { expect } from '@open-wc/testing';
import { HostingEnvironment } from '../../../src/braintree-manager/braintree-interfaces';
import { PaymentProviders } from '../../../src/braintree-manager/payment-providers';
import { PayPalHandler } from '../../../src/braintree-manager/payment-providers/paypal/paypal';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { mockHostedFieldConfig } from '../../mocks/mock-hosted-fields-config';
import { MockPaymentClients } from '../../mocks/mock-payment-clients';

describe('PaymentProviders', () => {
  describe('Venmo Handler', () => {
    it('returns an undefined venmo handler if no venmo id provided', async () => {
      const mockBraintreeManager = new MockBraintreeManager();
      const mockPaymentClients = new MockPaymentClients();
      const paymentProviders = new PaymentProviders({
        braintreeManager: mockBraintreeManager,
        paymentClients: mockPaymentClients,
        hostingEnvironment: HostingEnvironment.Development,
        hostedFieldConfig: mockHostedFieldConfig,
      });
      const venmo = await paymentProviders.venmoHandler.get();
      expect(venmo).to.be.undefined;
    });
  });

  describe('PayPal Handler', () => {
    it('can fetch the PayPalHandler', async () => {
      const mockBraintreeManager = new MockBraintreeManager();
      const mockPaymentClients = new MockPaymentClients();
      const paymentProviders = new PaymentProviders({
        braintreeManager: mockBraintreeManager,
        paymentClients: mockPaymentClients,
        hostingEnvironment: HostingEnvironment.Development,
        hostedFieldConfig: mockHostedFieldConfig,
      });
      const paypal = await paymentProviders.paypalHandler.get();
      expect(paypal instanceof PayPalHandler).to.be.true;
    });
  });
});
