import { BraintreeManagerInterface, HostingEnvironment } from '../../braintree-interfaces';
import { DonationPaymentInfo } from '../../../models/donation-info/donation-payment-info';
import {
  PayPalButtonDataSourceInterface,
  PayPalButtonDataSource,
} from './paypal-button-datasource';

export interface PayPalHandlerInterface {
  renderPayPalButton(params: {
    selector: string;
    style: paypal.ButtonStyle;
    donationInfo: DonationPaymentInfo;
  }): Promise<PayPalButtonDataSourceInterface | undefined>;
  getPayPalInstance(): Promise<braintree.PayPalCheckout | undefined>;
}

export class PayPalHandler implements PayPalHandlerInterface {
  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    paypalClient: braintree.PayPalCheckout;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypalLibrary: any;
    hostingEnvironment: HostingEnvironment;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.paypalClient = options.paypalClient;
    this.paypalLibrary = options.paypalLibrary;
    this.hostingEnvironment = options.hostingEnvironment;
  }

  private braintreeManager: BraintreeManagerInterface;

  private paypalClient: braintree.PayPalCheckout;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private paypalLibrary: any;

  private hostingEnvironment: HostingEnvironment;

  private paypalInstance: braintree.PayPalCheckout | undefined;

  private paypalInstancePromise?: Promise<braintree.PayPalCheckout | undefined>;

  async getPayPalInstance(): Promise<braintree.PayPalCheckout | undefined> {
    if (this.paypalInstance) {
      return this.paypalInstance;
    }

    // we only want one instance of this to be created so this chains the promise
    // calls if multiple callers request the instance
    if (this.paypalInstancePromise) {
      this.paypalInstancePromise = this.paypalInstancePromise.then(handler => {
        return handler;
      });
      return this.paypalInstancePromise;
    }

    this.paypalInstancePromise = this.braintreeManager
      .getInstance()
      .then(braintreeClient => {
        return this.paypalClient.create({
          client: braintreeClient,
        });
      })
      .then(instance => {
        this.paypalInstance = instance;
        return instance;
      });

    return this.paypalInstancePromise;
  }

  async renderPayPalButton(params: {
    selector: string;
    style: paypal.ButtonStyle;
    donationInfo: DonationPaymentInfo;
  }): Promise<PayPalButtonDataSourceInterface | undefined> {
    const env: paypal.Environment = (this.hostingEnvironment === HostingEnvironment.Development
      ? 'sandbox'
      : 'production') as paypal.Environment;

    const paypalInstance = await this.getPayPalInstance();
    if (!paypalInstance) {
      return;
    }

    const dataSource = new PayPalButtonDataSource({
      donationInfo: params.donationInfo,
      paypalInstance: paypalInstance,
    });

    await this.paypalLibrary.Button.render(
      {
        env,
        style: params.style,
        payment: dataSource.payment.bind(dataSource),
        onAuthorize: dataSource.onAuthorize.bind(dataSource),
        onCancel: dataSource.onCancel.bind(dataSource),
        onError: dataSource.onError.bind(dataSource),
      },
      params.selector,
    );

    return dataSource;
  }
}
