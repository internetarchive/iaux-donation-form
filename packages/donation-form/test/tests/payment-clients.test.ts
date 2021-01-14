/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from '@open-wc/testing';
import { HostingEnvironment } from '../../src/braintree-manager/braintree-interfaces';
import { PaymentClients } from '../../src/braintree-manager/payment-clients';
import { MockLazyLoader } from '../mocks/mock-lazy-loader';
import { MockApplePayClient } from '../mocks/payment-clients/mock-applepay-client';
import { MockBraintreeClient } from '../mocks/payment-clients/mock-braintree-client';
import { MockDeviceDataCollector } from '../mocks/payment-clients/mock-data-collector';
import { MockGooglePaymentClient } from '../mocks/payment-clients/mock-googlepay-client';
import { MockHostedFieldsClient } from '../mocks/payment-clients/mock-hostedfields-client';
import { MockVenmoClient } from '../mocks/payment-clients/mock-venmo-client';
import { MockGooglePayLibrary } from '../mocks/payment-clients/mock-googlepay-library';
import { MockRecaptchaManager } from '../mocks/mock-recaptcha-manager';
import { MockGrecaptcha, MockGrecaptchaMode } from '../mocks/payment-clients/mock-grecaptcha';
import { MockPayPalClient } from '../mocks/payment-clients/mock-paypal-client';
import { MockPaypalLibrary } from '../mocks/payment-clients/mock-paypal-library';

describe('PaymentClients', () => {
  it('returns the braintree client', async () => {
    const lazyLoader = new MockLazyLoader();
    const paymentClients = new PaymentClients(lazyLoader, HostingEnvironment.Development);
    const mockBraintreeClient = new MockBraintreeClient();
    (window.braintree as any) = {
      client: mockBraintreeClient,
    };
    const braintreeClient = await paymentClients.braintreeClient.get();
    expect(braintreeClient).to.equal(mockBraintreeClient);
    (window.braintree as any) = undefined;
  });

  it('returns the dataCollector client', async () => {
    const lazyLoader = new MockLazyLoader();
    const paymentClients = new PaymentClients(lazyLoader, HostingEnvironment.Development);
    const mockDataCollector = new MockDeviceDataCollector();
    (window.braintree as any) = {
      dataCollector: mockDataCollector,
    };
    const dataCollector = await paymentClients.dataCollector.get();
    expect(dataCollector).to.equal(dataCollector);
    (window.braintree as any) = undefined;
  });

  it('returns the hostedFields client', async () => {
    const lazyLoader = new MockLazyLoader();
    const paymentClients = new PaymentClients(lazyLoader, HostingEnvironment.Development);
    const mockHostedFields = new MockHostedFieldsClient();
    (window.braintree as any) = {
      hostedFields: mockHostedFields,
    };
    const hostedFields = await paymentClients.hostedFields.get();
    expect(hostedFields).to.equal(mockHostedFields);
    (window.braintree as any) = undefined;
  });

  it('returns the venmo client', async () => {
    const lazyLoader = new MockLazyLoader();
    const paymentClients = new PaymentClients(lazyLoader, HostingEnvironment.Development);
    const mockVenmo = new MockVenmoClient({ isBrowserSupported: true });
    (window.braintree as any) = {
      venmo: mockVenmo,
    };
    const venmo = await paymentClients.venmo.get();
    expect(venmo).to.equal(mockVenmo);
    (window.braintree as any) = undefined;
  });

  it('returns the PayPal client', async () => {
    const lazyLoader = new MockLazyLoader();
    const paymentClients = new PaymentClients(lazyLoader, HostingEnvironment.Development);
    const mockPaypal = new MockVenmoClient({ isBrowserSupported: true });
    (window.braintree as any) = {
      paypalCheckout: mockPaypal,
    };
    const paypal = await paymentClients.payPal.get();
    expect(paypal).to.equal(mockPaypal);
    (window.braintree as any) = undefined;
  });

  it('returns the ApplePay client', async () => {
    const lazyLoader = new MockLazyLoader();
    const paymentClients = new PaymentClients(lazyLoader, HostingEnvironment.Development);
    const mockApplePay = new MockApplePayClient();
    (window.braintree as any) = {
      applePay: mockApplePay,
    };
    const applePay = await paymentClients.applePay.get();
    expect(applePay).to.equal(mockApplePay);
    (window.braintree as any) = undefined;
  });

  it('returns the GooglePayBraintreeClient client', async () => {
    const lazyLoader = new MockLazyLoader();
    const paymentClients = new PaymentClients(lazyLoader, HostingEnvironment.Development);
    const mockGooglePay = new MockGooglePaymentClient();
    (window.braintree as any) = {
      googlePayment: mockGooglePay,
    };
    const googlePayment = await paymentClients.googlePayBraintreeClient.get();
    expect(googlePayment).to.equal(mockGooglePay);
    (window.braintree as any) = undefined;
  });

  it('returns the GooglePaymentsClient client', async () => {
    const lazyLoader = new MockLazyLoader();
    const paymentClients = new PaymentClients(lazyLoader, HostingEnvironment.Development);
    window.google = {
      payments: {
        api: {
          PaymentsClient: MockGooglePayLibrary,
        },
      },
    };
    const googlePayment = await paymentClients.googlePaymentsClient.get();
    expect(googlePayment instanceof MockGooglePayLibrary).to.be.true;
    (window.google as any) = undefined;
  });

  it('returns the recaptcha client', async () => {
    const lazyLoader = new MockLazyLoader();
    const paymentClients = new PaymentClients(lazyLoader, HostingEnvironment.Development);
    const mockGrecaptcha = new MockGrecaptcha(MockGrecaptchaMode.Success);
    window.grecaptcha = mockGrecaptcha;
    setTimeout(() => {
      // this callback needs to happen because the load happens asynchronously
      (window as any).donationFormGrecaptchaLoadedCallback();
    }, 10);
    const recaptchaLibrary = await paymentClients.recaptchaLibrary.get();
    expect(recaptchaLibrary).to.equal(mockGrecaptcha);
    (window.grecaptcha as any) = undefined;
  });

  it('returns the paypal library', async () => {
    const lazyLoader = new MockLazyLoader();
    const paymentClients = new PaymentClients(lazyLoader, HostingEnvironment.Development);
    const mockPaypal = new MockPaypalLibrary();
    (window as any).paypal = mockPaypal;
    const paypalLibrary = await paymentClients.paypalLibrary.get();
    expect(paypalLibrary).to.equal(mockPaypal);
    (window as any).paypal = undefined;
  });
});
