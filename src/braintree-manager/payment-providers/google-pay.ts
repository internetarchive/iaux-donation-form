import { BraintreeManagerInterface } from '../braintree-interfaces';

export interface GooglePayHandlerInterface {
  isBrowserSupported(): Promise<boolean>;
  getPaymentsClient(): Promise<google.payments.api.PaymentsClient>;
  getInstance(): Promise<braintree.GooglePayment>;
}

export class GooglePayHandler implements GooglePayHandlerInterface {
  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    googlePayMerchantId?: string;
    googlePayBraintreeClient: braintree.GooglePayment;
    googlePaymentsClient: google.payments.api.PaymentsClient;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.googlePayMerchantId = options.googlePayMerchantId;
    this.googlePayBraintreeClient = options.googlePayBraintreeClient;
    this.googlePaymentsClient = options.googlePaymentsClient;
  }

  private braintreeManager: BraintreeManagerInterface;

  private googlePayMerchantId?: string;

  private googlePayBraintreeClient: braintree.GooglePayment;

  private googlePayInstance?: braintree.GooglePayment;

  private googlePaymentsClient: google.payments.api.PaymentsClient;

  async isBrowserSupported(): Promise<boolean> {
    return this.googlePaymentsClient
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

  async getPaymentsClient(): Promise<google.payments.api.PaymentsClient> {
    return this.googlePaymentsClient;
  }

  private googlePayInstancePromise?: Promise<braintree.GooglePayment>;

  async getInstance(): Promise<braintree.GooglePayment> {
    if (this.googlePayInstance) {
      return this.googlePayInstance;
    }

    // we only want one instance of this to be created so this chains the promise
    // calls if multiple callers request the instance
    if (this.googlePayInstancePromise) {
      this.googlePayInstancePromise = this.googlePayInstancePromise.then(handler => {
        return handler;
      });
      return this.googlePayInstancePromise;
    }

    this.googlePayInstancePromise = this.braintreeManager
      .getInstance()
      .then(braintreeInstance => {
        return this.googlePayBraintreeClient.create({
          client: braintreeInstance,
          googlePayVersion: 2,
          googleMerchantId: this.googlePayMerchantId,
        });
      })
      .then(instance => {
        this.googlePayInstance = instance;
        return instance;
      });

    return this.googlePayInstancePromise;
  }
}
