/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from '@open-wc/testing';
import { MockApplePaySession } from '../../mocks/payment-clients/mock-applepay-session';
import { MockApplePaySessionDataSourceDelegate } from '../../mocks/payment-providers/individual-providers/mock-applepay-datasource-delegate';
import { ApplePaySessionDataSource } from '../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-session-datasource';
import { DonationPaymentInfo } from '../../../src/models/donation-info/donation-payment-info';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { MockApplePayClient } from '../../mocks/payment-clients/mock-applepay-client';
import { MockApplePayValidateMerchantEvent } from '../../mocks/payment-clients/mock-applepay-validatemerchantevent';
import { MockApplePayPaymentAuthorizedEvent } from '../../mocks/payment-clients/mock-applepay-paymentauthorizedevent';
import { SuccessResponse } from '../../../src/models/response-models/success-models/success-response';

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
    beforeEach(() => {
      (window['ApplePaySession' as any] as any) = MockApplePaySession;
    });

    afterEach(() => {
      delete window['ApplePaySession' as any];
    });

    it('notifies the delegate on payment completion and completes the session', async () => {
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

      const event = new MockApplePayPaymentAuthorizedEvent();

      await datasource.onpaymentauthorized(event);
      expect(session.completePaymentResult).to.equal(ApplePaySession.STATUS_SUCCESS);

      const response = delegate.paymentCompleteResponse;
      expect(response).to.not.be.undefined;
      expect(response?.success).to.be.true;

      const value = response?.value as SuccessResponse;
      expect(value.amount).to.equal(5);
      expect(value.customer.email).to.equal('foo@bar.com');
      expect(value.billing.streetAddress).to.equal('123 Fake St');
      expect(value.billing.extendedAddress).to.equal('Apt 123');
    });

    it('on tokenization failure, notifies the delegate and completes the session with a failure', async () => {
      const session = new MockApplePaySession();
      const instance = new MockApplePayClient({ shouldTokenizeSuccessfully: false });
      const braintreeManager = new MockBraintreeManager();
      const delegate = new MockApplePaySessionDataSourceDelegate();
      const datasource = new ApplePaySessionDataSource({
        donationInfo: DonationPaymentInfo.default,
        session: session,
        applePayInstance: instance,
        braintreeManager: braintreeManager,
      });
      datasource.delegate = delegate;

      const event = new MockApplePayPaymentAuthorizedEvent();

      await datasource.onpaymentauthorized(event);
      expect(session.completePaymentResult).to.equal(ApplePaySession.STATUS_FAILURE);
      const result = delegate.paymentFailedError;
      expect(result).to.deep.equal({
        code: 'foo',
        details: 'foo bar',
        message: 'bar',
        type: 'CUSTOMER',
      });
    });

    it('on submission failure, notifies the delegate and completes the session with a failure', async () => {
      const session = new MockApplePaySession();
      const instance = new MockApplePayClient({ shouldTokenizeSuccessfully: true });
      const braintreeManager = new MockBraintreeManager({ submitDonationResponse: 'failure' });
      const delegate = new MockApplePaySessionDataSourceDelegate();
      const datasource = new ApplePaySessionDataSource({
        donationInfo: DonationPaymentInfo.default,
        session: session,
        applePayInstance: instance,
        braintreeManager: braintreeManager,
      });
      datasource.delegate = delegate;

      const event = new MockApplePayPaymentAuthorizedEvent();

      await datasource.onpaymentauthorized(event);
      expect(session.completePaymentResult).to.equal(ApplePaySession.STATUS_FAILURE);
      const result = delegate.paymentFailedError;
      expect(result).to.equal('Failure submitting data');
    });

    it('on submission error, notifies the delegate and completes the session with a failure', async () => {
      const session = new MockApplePaySession();
      const instance = new MockApplePayClient({ shouldTokenizeSuccessfully: true });
      const braintreeManager = new MockBraintreeManager({ submitDonationError: true });
      const delegate = new MockApplePaySessionDataSourceDelegate();
      const datasource = new ApplePaySessionDataSource({
        donationInfo: DonationPaymentInfo.default,
        session: session,
        applePayInstance: instance,
        braintreeManager: braintreeManager,
      });
      datasource.delegate = delegate;

      const event = new MockApplePayPaymentAuthorizedEvent();

      await datasource.onpaymentauthorized(event);
      expect(session.completePaymentResult).to.equal(ApplePaySession.STATUS_FAILURE);
      const result = delegate.paymentFailedError;
      expect(result).to.equal('oh no');
    });
  });
});
