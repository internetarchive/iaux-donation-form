import { DonationPaymentInfo } from '../../../models/donation-info/donation-payment-info';
import { DonationType } from '../../../models/donation-info/donation-type';

import currency from 'currency.js';

/**
 * PayPayButtonDataSource is responsible for communicating with the PayPal button.
 *
 * The PayPal button cannot live in the ShadowDOM so we have to instantiate it at the
 * top of the DOM and it lives in the global sphere. This makes it difficult to communicate
 * with it directly. The PayPalButtonDataSource provides an object that we can pass around
 * that hooks into all of the PayPal button's callbacks and provides callbacks to its
 * delegate that is interested in the various events.
 *
 * @export
 * @interface PayPalButtonDataSourceInterface
 */
export interface PayPalButtonDataSourceInterface {
  /**
   * The delegate to inform about button events
   *
   * @type {PayPalButtonDataSourceDelegate}
   * @memberof PayPalButtonDataSourceInterface
   */
  delegate?: PayPalButtonDataSourceDelegate;

  /**
   * The Donation Info associated with this button.
   *
   * Since the user initiates the checkout flow from the button itself (not programatically by us),
   * we need to have up-to-date donation information so whenever the user updates donation info
   * from the form, we update this.
   *
   * @type {DonationPaymentInfo}
   * @memberof PayPalButtonDataSourceInterface
   */
  donationInfo: DonationPaymentInfo;

  /**
   * The payment has been started by the user (they clicked the PayPal button)
   *
   * @returns {Promise<string>}
   * @memberof PayPalButtonDataSourceInterface
   */
  payment(): Promise<string>;

  /**
   * The user has authorized the donation
   *
   * @param {paypal.AuthorizationData} data
   * @param {object} actions
   * @returns {(Promise<paypal.TokenizePayload | undefined>)}
   * @memberof PayPalButtonDataSourceInterface
   */
  onAuthorize(
    data: paypal.AuthorizationData,
    actions: object,
  ): Promise<paypal.TokenizePayload | undefined>;

  /**
   * The user cancelled the donation
   *
   * @param {paypal.CancellationData} data
   * @memberof PayPalButtonDataSourceInterface
   */
  onCancel(data: paypal.CancellationData): void;

  /**
   * An error occurred
   *
   * @param {string} error
   * @memberof PayPalButtonDataSourceInterface
   */
  onError(error: string): void;
}

/**
 * The PayPalButtonDataSourceDelegate is an interface for any object interested
 * in events emitted by the paypal button.
 *
 * @export
 * @interface PayPalButtonDataSourceDelegate
 */
export interface PayPalButtonDataSourceDelegate {
  /**
   * Payment has been started
   *
   * @param {PayPalButtonDataSourceInterface} dataSource
   * @param {object} options
   * @returns {Promise<void>}
   * @memberof PayPalButtonDataSourceDelegate
   */
  payPalPaymentStarted(dataSource: PayPalButtonDataSourceInterface, options: object): Promise<void>;

  /**
   * Payment has been authorized
   *
   * @param {PayPalButtonDataSourceInterface} dataSource
   * @param {paypal.TokenizePayload} payload
   * @returns {Promise<void>}
   * @memberof PayPalButtonDataSourceDelegate
   */
  payPalPaymentAuthorized(
    dataSource: PayPalButtonDataSourceInterface,
    payload: paypal.TokenizePayload,
  ): Promise<void>;

  /**
   * Payment has been cancelled
   *
   * @param {PayPalButtonDataSourceInterface} dataSource
   * @param {object} data
   * @returns {Promise<void>}
   * @memberof PayPalButtonDataSourceDelegate
   */
  payPalPaymentCancelled(dataSource: PayPalButtonDataSourceInterface, data: object): Promise<void>;

  /**
   * There was a payment error
   *
   * @param {PayPalButtonDataSourceInterface} dataSource
   * @param {string} error
   * @returns {Promise<void>}
   * @memberof PayPalButtonDataSourceDelegate
   */
  payPalPaymentError(dataSource: PayPalButtonDataSourceInterface, error: string): Promise<void>;
}

/** @inheritdoc */
export class PayPalButtonDataSource implements PayPalButtonDataSourceInterface {
  /** @inheritdoc */
  delegate?: PayPalButtonDataSourceDelegate;

  /** @inheritdoc */
  donationInfo: DonationPaymentInfo;

  /**
   * The PayPal instance
   *
   * @private
   * @type {braintree.PayPalCheckout}
   * @memberof PayPalButtonDataSource
   */
  private paypalInstance: braintree.PayPalCheckout;

  constructor(options: {
    donationInfo: DonationPaymentInfo;
    paypalInstance: braintree.PayPalCheckout;
  }) {
    this.donationInfo = options.donationInfo;
    this.paypalInstance = options.paypalInstance;
  }

  /** @inheritdoc */
  async payment(): Promise<string> {
    console.log('PayPalButtonDataSource payment, donationInfo', this, this.donationInfo);

    const donationType = this.donationInfo.donationType;
    const flow = donationType === DonationType.OneTime ? 'checkout' : 'vault';

    const options: braintree.PayPalCheckoutCreatePaymentOptions = {
      flow: flow as paypal.FlowType,
    };
    options.enableShippingAddress = true;

    if (flow === 'checkout') {
      options.amount = this.donationInfo.total;
      options.currency = 'USD';
    } else {
      options.billingAgreementDescription = `Subscribe to donate ${currency(
        this.donationInfo.total,
        { symbol: '$' },
      ).format()} monthly`;
    }

    this.delegate?.payPalPaymentStarted(this, options);

    return this.paypalInstance.createPayment(options);
  }

  /** @inheritdoc */
  async onAuthorize(data: paypal.AuthorizationData): Promise<paypal.TokenizePayload> {
    const payload: paypal.TokenizePayload = await this.paypalInstance.tokenizePayment(data);

    this.delegate?.payPalPaymentAuthorized(this, payload);

    return payload;
  }

  /** @inheritdoc */
  onCancel(data: object): void {
    this.delegate?.payPalPaymentCancelled(this, data);
  }

  /** @inheritdoc */
  onError(error: string): void {
    console.error('PayPal error', error);
    this.delegate?.payPalPaymentError(this, error);
  }
}
