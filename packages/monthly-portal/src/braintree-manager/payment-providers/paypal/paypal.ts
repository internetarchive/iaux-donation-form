import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { BraintreeManagerInterface, HostingEnvironment } from '../../braintree-interfaces';
import { DonationPaymentInfo } from '@internetarchive/donation-form-data-models';
import {
  PayPalButtonDataSourceInterface,
  PayPalButtonDataSource,
} from './paypal-button-datasource';
import { PayPalHandlerInterface } from './paypal-interface';

export class PayPalHandler implements PayPalHandlerInterface {
  instance: PromisedSingleton<braintree.PayPalCheckout | undefined>;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    paypalClient: braintree.PayPalCheckout;
    paypalButton: paypal.ButtonRenderer;
    hostingEnvironment: HostingEnvironment;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.paypalClient = options.paypalClient;
    this.paypalButtonGenerator = options.paypalButton;
    this.hostingEnvironment = options.hostingEnvironment;

    this.instance = new PromisedSingleton<braintree.PayPalCheckout | undefined>({
      generator: (): Promise<braintree.PayPalCheckout> =>
        this.braintreeManager.instance.get().then(braintreeClient => {
          return this.paypalClient.create({
            client: braintreeClient,
          });
        }),
    });
  }

  private braintreeManager: BraintreeManagerInterface;

  private paypalClient: braintree.PayPalCheckout;

  private paypalButtonGenerator: paypal.ButtonRenderer;

  private hostingEnvironment: HostingEnvironment;

  async renderPayPalButton(params: {
    selector: string;
    style: paypal.ButtonStyle;
    donationInfo: DonationPaymentInfo;
  }): Promise<PayPalButtonDataSourceInterface | undefined> {
    const env: paypal.Environment = (
      this.hostingEnvironment === HostingEnvironment.Development ? 'sandbox' : 'production'
    ) as paypal.Environment;

    const paypalInstance = await this.instance.get();
    if (!paypalInstance) {
      return;
    }

    const dataSource = new PayPalButtonDataSource({
      donationInfo: params.donationInfo,
      paypalInstance: paypalInstance,
    });

    this.paypalButtonGenerator.render(
      {
        env,
        style: params.style,
        payment: dataSource.payment.bind(dataSource),
        onAuthorize: dataSource.onAuthorize.bind(dataSource),
        onCancel: dataSource.onCancel.bind(dataSource),
        onError: dataSource.onError.bind(dataSource),
        funding: {
          disallowed: [paypal.FUNDING.VENMO],
        },
      },
      params.selector,
    );

    return dataSource;
  }
}
