import { BraintreeManagerInterface, HostingEnvironment } from '../../braintree-interfaces';
import { DonationPaymentInfo } from '../../../models/donation-info/donation-payment-info';
import {
  PayPalButtonDataSourceInterface,
  PayPalButtonDataSource,
} from './paypal-button-datasource';
import { PromisedSingleton } from '../../../util/promised-singleton';

export interface PayPalHandlerInterface {
  instance: PromisedSingleton<braintree.PayPalCheckout | undefined>;

  renderPayPalButton(params: {
    selector: string;
    style: paypal.ButtonStyle;
    donationInfo: DonationPaymentInfo;
  }): Promise<PayPalButtonDataSourceInterface | undefined>;
}

export class PayPalHandler implements PayPalHandlerInterface {
  instance: PromisedSingleton<braintree.PayPalCheckout | undefined>;

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

    this.instance = new PromisedSingleton<braintree.PayPalCheckout | undefined>(
      this.braintreeManager.instance.get().then(braintreeClient => {
        return this.paypalClient.create({
          client: braintreeClient,
        });
      }),
    );
  }

  private braintreeManager: BraintreeManagerInterface;

  private paypalClient: braintree.PayPalCheckout;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private paypalLibrary: any;

  private hostingEnvironment: HostingEnvironment;

  async renderPayPalButton(params: {
    selector: string;
    style: paypal.ButtonStyle;
    donationInfo: DonationPaymentInfo;
  }): Promise<PayPalButtonDataSourceInterface | undefined> {
    const env: paypal.Environment = (this.hostingEnvironment === HostingEnvironment.Development
      ? 'sandbox'
      : 'production') as paypal.Environment;

    const paypalInstance = await this.instance.get();
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
