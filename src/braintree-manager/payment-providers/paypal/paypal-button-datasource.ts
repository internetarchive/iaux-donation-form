import { DonationPaymentInfo } from "../../../models/donation-info/donation-payment-info";
import { DonationType } from "../../../models/donation-info/donation-type";

import currency from 'currency.js';

export interface PayPalButtonDataSourceInterface {
  delegate?: PayPalButtonDataSourceDelegate;
  donationInfo: DonationPaymentInfo;
  payment(): Promise<string>;
  onAuthorize(data: paypal.AuthorizationData, actions: object): Promise<paypal.TokenizePayload | undefined>;
  onCancel(data: paypal.CancellationData): void;
  onError(error: string): void;
}

export interface PayPalButtonDataSourceDelegate {
  payPalPaymentStarted(dataSource: PayPalButtonDataSourceInterface, options: object): Promise<void>;
  payPalPaymentAuthorized(dataSource: PayPalButtonDataSourceInterface, payload: paypal.TokenizePayload): Promise<void>;
  payPalPaymentCancelled(dataSource: PayPalButtonDataSourceInterface, data: object): Promise<void>;
  payPalPaymentError(dataSource: PayPalButtonDataSourceInterface, error: string): Promise<void>;
}

export class PayPalButtonDataSource implements PayPalButtonDataSourceInterface {
  delegate?: PayPalButtonDataSourceDelegate;

  donationInfo: DonationPaymentInfo;

  private paypalInstance: braintree.PayPalCheckout;

  constructor(options: {
    donationInfo: DonationPaymentInfo;
    paypalInstance: braintree.PayPalCheckout;
  }) {
    this.donationInfo = options.donationInfo;
    this.paypalInstance = options.paypalInstance;
  }

  async payment(): Promise<string> {
    console.log('PayPalButtonDataSource payment, donationInfo', this, this.donationInfo);

    const options: any = {};
    options.enableShippingAddress = true;

    const donationType = this.donationInfo.donationType;
    const flow = donationType === DonationType.OneTime ? 'checkout' : 'vault';
    options.flow = flow as paypal.FlowType;

    if (flow === 'checkout') {
      options.amount = this.donationInfo.total;
      options.currency = 'USD';
    } else {
      options.billingAgreementDescription = `Subscribe to donate ${currency(this.donationInfo.total, { formatWithSymbol: true }).format()} monthly`
    }

    this.delegate?.payPalPaymentStarted(this, options);

    return this.paypalInstance.createPayment(options);
  }

  async onAuthorize(data: paypal.AuthorizationData): Promise<paypal.TokenizePayload | undefined> {
    const payload: paypal.TokenizePayload = await this.paypalInstance.tokenizePayment(data);

    console.debug('onAuthorize data', data, 'payload', payload);

    this.delegate?.payPalPaymentAuthorized(this, payload);

    return payload;
  }

  onCancel(data: object): void {
    console.debug('cancel', data);
    this.delegate?.payPalPaymentCancelled(this, data);
  }

  onError(error: string): void {
    console.error('error', error);
    this.delegate?.payPalPaymentError(this, error);
  }
}
