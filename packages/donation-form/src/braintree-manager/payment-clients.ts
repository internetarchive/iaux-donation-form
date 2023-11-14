import { LazyLoaderServiceInterface } from '@internetarchive/lazy-loader-service';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { HostingEnvironment } from './braintree-interfaces';

export interface PaymentClientsInterface {
  braintreeClient: PromisedSingleton<braintree.Client>;
  dataCollector: PromisedSingleton<braintree.DataCollector>;
  hostedFields: PromisedSingleton<braintree.HostedFields>;
  venmo: PromisedSingleton<braintree.Venmo>;
  payPal: PromisedSingleton<braintree.PayPalCheckout>;
  applePay: PromisedSingleton<braintree.ApplePay>;
  googlePayBraintreeClient: PromisedSingleton<braintree.GooglePayment>;

  googlePaymentsClient: PromisedSingleton<google.payments.api.PaymentsClient>;
  recaptchaLibrary: PromisedSingleton<ReCaptchaV2.ReCaptcha>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paypalLibrary: PromisedSingleton<any>;
}

/**
 * The PaymentClients class is responsible for loading and passing around
 * all of the payment libraries. Internally it uses the LazyLoaderService to lazy load
 * the javascript clients.
 *
 * For instance, it carries around the braintree and paypal libraries, as well as the specific
 * payment-provider clients for each of the providers. This allows us to pass around typed
 * objects instead of the untyped libraries we get from the providers.
 *
 * @export
 * @class PaymentClients
 * @implements {PaymentClientsInterface}
 */
export class PaymentClients implements PaymentClientsInterface {
  braintreeClient = new PromisedSingleton<braintree.Client>({
    generator: async (): Promise<braintree.Client> => {
      await this.loadBraintreeScript('client');
      return window.braintree.client;
    },
  });

  dataCollector = new PromisedSingleton<braintree.DataCollector>({
    generator: async (): Promise<braintree.DataCollector> => {
      await this.loadBraintreeScript('data-collector');
      return window.braintree.dataCollector;
    },
  });

  hostedFields = new PromisedSingleton<braintree.HostedFields>({
    generator: async (): Promise<braintree.HostedFields> => {
      await this.loadBraintreeScript('hosted-fields');
      return window.braintree.hostedFields;
    },
  });

  venmo = new PromisedSingleton<braintree.Venmo>({
    generator: async (): Promise<braintree.Venmo> => {
      await this.loadBraintreeScript('venmo');
      return window.braintree.venmo;
    },
  });

  payPal = new PromisedSingleton<braintree.PayPalCheckout>({
    generator: async (): Promise<braintree.PayPalCheckout> => {
      await this.loadBraintreeScript('paypal-checkout');
      return window.braintree.paypalCheckout;
    },
  });

  applePay = new PromisedSingleton<braintree.ApplePay>({
    generator: async (): Promise<braintree.ApplePay> => {
      await this.loadBraintreeScript('apple-pay');
      return window.braintree.applePay;
    },
  });

  googlePayBraintreeClient = new PromisedSingleton<braintree.GooglePayment>({
    generator: async (): Promise<braintree.GooglePayment> => {
      await this.loadBraintreeScript('google-payment');
      return window.braintree.googlePayment;
    },
  });

  googlePaymentsClient = new PromisedSingleton<google.payments.api.PaymentsClient>({
    generator: async (): Promise<google.payments.api.PaymentsClient> => {
      await this.lazyLoader.loadScript({ src: 'https://pay.google.com/gp/p/js/pay.js' });
      return new google.payments.api.PaymentsClient({
        environment: this.environment === HostingEnvironment.Development ? 'TEST' : 'PRODUCTION',
      });
    },
  });

  recaptchaLibrary = new PromisedSingleton<ReCaptchaV2.ReCaptcha>({
    generator: (): Promise<ReCaptchaV2.ReCaptcha> =>
      new Promise(resolve => {
        // The loader for the recaptcha library is relying on an onload callback from the recaptcha
        // library because even when the library has loaded, it is still not ready
        // As recommended by Recaptcha, we attach a callback to the window object before starting
        // the load and remove it once the load is complete and resolve the promise.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).donationFormGrecaptchaLoadedCallback = (): void => {
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (window as any).donationFormGrecaptchaLoadedCallback;
          }, 10);
          resolve(window.grecaptcha);
        };

        this.lazyLoader.loadScript({
          src: 'https://www.google.com/recaptcha/api.js?onload=donationFormGrecaptchaLoadedCallback&render=explicit',
        });
      }),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paypalLibrary = new PromisedSingleton<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generator: async (): Promise<any> => {
      await this.lazyLoader.loadScript({
        src: 'https://www.paypalobjects.com/api/checkout.js',
        attributes: {
          'data-version-4': '',
          'log-level': 'warn',
        },
      });
      return window.paypal;
    },
  });

  constructor(lazyLoader: LazyLoaderServiceInterface, environment: HostingEnvironment) {
    this.lazyLoader = lazyLoader;
    this.environment = environment;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async loadBraintreeScript(scriptName: string): Promise<void> {
    const extension = this.environment === HostingEnvironment.Production ? 'min.js' : 'js';
    const scriptWithSuffix = `${scriptName}.${extension}`;
    const url = `https://js.braintreegateway.com/web/${this.braintreeVersion}/js/${scriptWithSuffix}`;
    await this.lazyLoader.loadScript({ src: url });
  }

  private braintreeVersion = '3.62.2';

  private environment: HostingEnvironment = HostingEnvironment.Development;

  private lazyLoader: LazyLoaderServiceInterface;
}
