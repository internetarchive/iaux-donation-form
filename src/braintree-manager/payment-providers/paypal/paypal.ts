import { BraintreeManagerInterface, HostingEnvironment } from '../../braintree-interfaces';
import { DonationPaymentInfo } from '../../../models/donation-info/donation-payment-info';
import { PayPalButtonDataSourceInterface, PayPalButtonDataSource } from './paypal-button-datasource';

export interface PayPalHandlerInterface {
  renderPayPalButton(params: {
    selector: string;
    style: paypal.ButtonStyle;
    donationInfo: DonationPaymentInfo;
  }): Promise<PayPalButtonDataSourceInterface | undefined>;
  getPayPalInstance(): Promise<braintree.PayPalCheckout | undefined>;
}

export class PayPalHandler implements PayPalHandlerInterface {
  constructor(
    braintreeManager: BraintreeManagerInterface,
    paypalClient: braintree.PayPalCheckout,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypalLibrary: any,
    hostingEnvironment: HostingEnvironment
  ) {
    this.braintreeManager = braintreeManager;
    this.paypalClient = paypalClient;
    this.paypalLibrary = paypalLibrary;
    this.hostingEnvironment = hostingEnvironment;

    console.log('PayPalHandler', paypalLibrary, paypalClient);
  }

  private braintreeManager: BraintreeManagerInterface;

  private paypalClient: braintree.PayPalCheckout;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private paypalLibrary: any;

  private hostingEnvironment: HostingEnvironment;

  private paypalInstance: braintree.PayPalCheckout | undefined;

  async getPayPalInstance(): Promise<braintree.PayPalCheckout | undefined> {
    if (this.paypalInstance) {
      return this.paypalInstance;
    }

    const braintreeClient = await this.braintreeManager.getInstance();
    // const paypalClient = this.braintreeManager.braintree;

    return new Promise((resolve, reject) => {
      this.paypalClient.create({
        client: braintreeClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, (error: any, instance: braintree.PayPalCheckout) => {
        // console.log('instance', error, instance, instance.merchantIdentifier);
        if (error) {
          return reject(error);
        }

        this.paypalInstance = instance;
        resolve(instance);
      });
    });
  }

  async renderPayPalButton(params: {
    selector: string;
    style: paypal.ButtonStyle;
    donationInfo: DonationPaymentInfo;
  }): Promise<PayPalButtonDataSourceInterface | undefined> {
    const env: paypal.Environment = (this.hostingEnvironment === HostingEnvironment.Development ? 'sandbox' : 'production') as paypal.Environment;

    console.log('renderPayPalButton', params.donationInfo);

    const paypalInstance = await this.getPayPalInstance();
    if (!paypalInstance) { return; }

    const dataSource = new PayPalButtonDataSource({
      donationInfo: params.donationInfo,
      paypalInstance: paypalInstance
    });

    this.paypalLibrary.Button.render({
      env,
      style: params.style,
      payment: dataSource.payment.bind(dataSource),
      onAuthorize: dataSource.onAuthorize.bind(dataSource),
      onCancel: dataSource.onCancel.bind(dataSource),
      onError: dataSource.onError.bind(dataSource)
    }, params.selector).then(() => {
      console.log('PayPal button set up');
    });

    return dataSource;
  }
}
