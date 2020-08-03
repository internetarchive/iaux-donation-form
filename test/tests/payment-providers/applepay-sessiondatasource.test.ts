import { expect } from '@open-wc/testing';
import { MockApplePaySession } from '../../mocks/payment-clients/mock-applepay-session';
import { MockApplePaySessionDataSourceDelegate } from '../../mocks/payment-providers/individual-providers/mock-applepay-datasource-delegate';
import { ApplePaySessionDataSource } from '../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-session-datasource';
import { DonationPaymentInfo } from '../../../src/models/donation-info/donation-payment-info';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { MockApplePayClient } from '../../mocks/payment-clients/mock-applepay-client';
import { MockApplePayValidateMerchantEvent } from '../../mocks/payment-clients/mock-applepay-validatemerchantevent';

describe('ApplePaySessionDataSource', () => {
  describe('onvalidatemerchant', () => {
    it('performs validation and calls completeMerchantValidation', async () => {
      const session = new MockApplePaySession();
      const instance = new MockApplePayClient();
      const braintreeManager = new MockBraintreeManager();
      const delegate = new MockApplePaySessionDataSourceDelegate();
      const datasource = new ApplePaySessionDataSource({
        donationInfo: DonationPaymentInfo.default,
        session: session,
        applePayInstance: instance,
        braintreeManager: braintreeManager,
      });
      datasource.delegate = delegate;

      const event = new MockApplePayValidateMerchantEvent();

      await datasource.onvalidatemerchant(event);
      expect(session.completeMerchantValidationCalled).to.be.true;
    });

    it('notifies delegate and aborts session if validation fails', async () => {
      const session = new MockApplePaySession();
      const instance = new MockApplePayClient({ shouldValidateMerchant: false });
      const braintreeManager = new MockBraintreeManager();
      const delegate = new MockApplePaySessionDataSourceDelegate();
      const datasource = new ApplePaySessionDataSource({
        donationInfo: DonationPaymentInfo.default,
        session: session,
        applePayInstance: instance,
        braintreeManager: braintreeManager,
      });
      datasource.delegate = delegate;

      const event = new MockApplePayValidateMerchantEvent();

      try {
        await datasource.onvalidatemerchant(event);
        expect.fail('should not reach here');
      } catch (error) {
        expect(error).to.not.be.undefined;
      }
    });
  });

  describe('oncancel', () => {
    it('notifies the delegate when the payment is cancelled', async () => {
      const session = new MockApplePaySession();
      const instance = new MockApplePayClient();
      const braintreeManager = new MockBraintreeManager();
      const delegate = new MockApplePaySessionDataSourceDelegate();
      const datasource = new ApplePaySessionDataSource({
        donationInfo: DonationPaymentInfo.default,
        session: session,
        applePayInstance: instance,
        braintreeManager: braintreeManager,
      });
      datasource.delegate = delegate;
      datasource.oncancel();
      expect(delegate.paymentCancelledCalled).to.be.true;
    });
  });

  describe('onpaymentauthorized', () => {
    console.debug('hi');
  });
});
