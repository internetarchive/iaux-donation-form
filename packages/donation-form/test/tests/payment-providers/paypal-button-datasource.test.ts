import { expect } from '@open-wc/testing';
import { MockPayPalClient } from '../../mocks/payment-clients/mock-paypal-client';
import { DonationPaymentInfo, DonationType } from '@internetarchive/donation-form-data-models';
import { PayPalButtonDataSource } from '../../../src/braintree-manager/payment-providers/paypal/paypal-button-datasource';
import { MockPayPalButtonDataSourceDelegate } from '../../mocks/payment-providers/individual-providers/mock-paypal-button-datasource';

describe('PayPalButtonDataSource', () => {
  describe('Payment start', () => {
    it('notifies the delegate and creates the payment when the `payment()` callback is triggered from a button press', async () => {
      const delegate = new MockPayPalButtonDataSourceDelegate();
      const paypalInstance = new MockPayPalClient();
      const donation = new DonationPaymentInfo({
        donationType: DonationType.Monthly,
        amount: 3.5,
        coverFees: false,
      });
      const datasource = new PayPalButtonDataSource({
        donationInfo: donation,
        paypalInstance: paypalInstance,
      });

      datasource.delegate = delegate;

      const result = await datasource.payment();

      expect(delegate.paymentStartedResults.called).to.be.true;
      expect(result).to.equal('createPaymentCalled');
    });

    it('sends the proper one-time donation request', async () => {
      const delegate = new MockPayPalButtonDataSourceDelegate();
      const paypalInstance = new MockPayPalClient();
      const donation = new DonationPaymentInfo({
        donationType: DonationType.OneTime,
        amount: 3.5,
        coverFees: false,
      });
      const datasource = new PayPalButtonDataSource({
        donationInfo: donation,
        paypalInstance: paypalInstance,
      });
      datasource.delegate = delegate;
      await datasource.payment();
      expect(delegate.paymentStartedResults.options).to.deep.equal({
        flow: 'checkout',
        enableShippingAddress: true,
        amount: 3.5,
        currency: 'USD',
      });
    });

    it('sends the proper one-time donation request with fees covered', async () => {
      const baseAmount = 3.5;
      const expectedTotal = DonationPaymentInfo.calculateTotal(baseAmount, true);
      const delegate = new MockPayPalButtonDataSourceDelegate();
      const paypalInstance = new MockPayPalClient();
      const donation = new DonationPaymentInfo({
        donationType: DonationType.OneTime,
        amount: baseAmount,
        coverFees: true,
      });
      const datasource = new PayPalButtonDataSource({
        donationInfo: donation,
        paypalInstance: paypalInstance,
      });
      datasource.delegate = delegate;
      await datasource.payment();
      expect(delegate.paymentStartedResults.options).to.deep.equal({
        flow: 'checkout',
        enableShippingAddress: true,
        amount: expectedTotal,
        currency: 'USD',
      });
    });

    it('sends the proper monthly donation request', async () => {
      const delegate = new MockPayPalButtonDataSourceDelegate();
      const paypalInstance = new MockPayPalClient();
      const donation = new DonationPaymentInfo({
        donationType: DonationType.Monthly,
        amount: 1.5,
        coverFees: false,
      });
      const datasource = new PayPalButtonDataSource({
        donationInfo: donation,
        paypalInstance: paypalInstance,
      });
      datasource.delegate = delegate;
      await datasource.payment();
      expect(delegate.paymentStartedResults.options).to.deep.equal({
        flow: 'vault',
        enableShippingAddress: true,
        billingAgreementDescription: 'Subscribe to donate $1.50 monthly',
      });
    });
  });

  describe('Payment authorized', () => {
    it('it tokenizes the payment and notifies the delegate when the payment is authorized', async () => {
      const delegate = new MockPayPalButtonDataSourceDelegate();
      const paypalInstance = new MockPayPalClient();
      const donation = new DonationPaymentInfo({
        donationType: DonationType.OneTime,
        amount: 3.5,
        coverFees: false,
      });
      const datasource = new PayPalButtonDataSource({
        donationInfo: donation,
        paypalInstance: paypalInstance,
      });

      const authData: paypal.AuthorizationData = {
        payerId: 'foo',
        paymentId: '1234',
      };

      datasource.delegate = delegate;

      const result = await datasource.onAuthorize(authData);

      expect(delegate.paymentAuthorizedResults.called).to.be.true;
      expect(delegate.paymentAuthorizedResults.payload?.nonce).to.equal('foo-nonce');

      expect(result.nonce).to.equal('foo-nonce');
      expect(result.type).to.equal('foo-type');
    });
  });

  describe('Payment cancelled', () => {
    it('it notifies the delegate when the payment is cancelled', async () => {
      const delegate = new MockPayPalButtonDataSourceDelegate();
      const paypalInstance = new MockPayPalClient();
      const donation = new DonationPaymentInfo({
        donationType: DonationType.OneTime,
        amount: 3.5,
        coverFees: false,
      });
      const datasource = new PayPalButtonDataSource({
        donationInfo: donation,
        paypalInstance: paypalInstance,
      });

      const cancelData = {
        foo: 'bar',
      };

      datasource.delegate = delegate;

      datasource.onCancel(cancelData);

      expect(delegate.paymentCancelledResults.called).to.be.true;
      expect(delegate.paymentCancelledResults.data).to.deep.equal(cancelData);
    });
  });

  describe('Payment error', () => {
    it('it notifies the delegate when there has been a payment error', async () => {
      const delegate = new MockPayPalButtonDataSourceDelegate();
      const paypalInstance = new MockPayPalClient();
      const donation = new DonationPaymentInfo({
        donationType: DonationType.OneTime,
        amount: 3.5,
        coverFees: false,
      });
      const datasource = new PayPalButtonDataSource({
        donationInfo: donation,
        paypalInstance: paypalInstance,
      });

      const error = 'foo-error';

      datasource.delegate = delegate;

      datasource.onError(error);

      expect(delegate.paymentErrorResults.called).to.be.true;
      expect(delegate.paymentErrorResults.error).to.equal(error);
    });
  });
});
