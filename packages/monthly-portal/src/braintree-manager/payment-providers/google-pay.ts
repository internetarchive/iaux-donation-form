import { PromisedSingleton } from '@internetarchive/promised-singleton';

import { BraintreeManagerInterface } from '../braintree-interfaces';
import { GooglePayHandlerInterface } from './google-pay-interface';

export class GooglePayHandler implements GooglePayHandlerInterface {
  paymentsClient: google.payments.api.PaymentsClient;

  instance: PromisedSingleton<braintree.GooglePayment>;

  async isBrowserSupported(): Promise<boolean> {
    return this.paymentsClient
      .isReadyToPay({
        // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest for all options
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY'],
              allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
            },
          },
        ],
        existingPaymentMethodRequired: false,
      })
      .then(isReadyToPay => isReadyToPay.result);
  }

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    googlePayMerchantId?: string;
    googlePayBraintreeClient: braintree.GooglePayment;
    googlePaymentsClient: google.payments.api.PaymentsClient;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.googlePayMerchantId = options.googlePayMerchantId;
    this.googlePayBraintreeClient = options.googlePayBraintreeClient;
    this.paymentsClient = options.googlePaymentsClient;

    this.instance = new PromisedSingleton<braintree.GooglePayment>({
      generator: (): Promise<braintree.GooglePayment> =>
        this.braintreeManager.instance.get().then((braintreeInstance: braintree.Client) => {
          return this.googlePayBraintreeClient.create({
            client: braintreeInstance,
            googlePayVersion: 2,
            googleMerchantId: this.googlePayMerchantId,
          });
        }),
    });
  }

  private braintreeManager: BraintreeManagerInterface;

  private googlePayMerchantId?: string;

  private googlePayBraintreeClient: braintree.GooglePayment;
}
