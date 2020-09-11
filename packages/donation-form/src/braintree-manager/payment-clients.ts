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

  constructor(lazyLoader: LazyLoaderServiceInterface, environment: HostingEnvironment) {
    this.lazyLoader = lazyLoader;
    this.environment = environment;

    this.braintreeClient = new PromisedSingleton<braintree.Client>({
      generator: this.loadBraintreeScript('client').then(() => {
        return window.braintree.client;
      }),
    });

    this.dataCollector = new PromisedSingleton<braintree.DataCollector>({
      generator: this.loadBraintreeScript('data-collector').then(() => {
        return window.braintree.dataCollector;
      }),
    });

    this.hostedFields = new PromisedSingleton<braintree.HostedFields>({
      generator: this.loadBraintreeScript('hosted-fields').then(() => {
        return window.braintree.hostedFields;
      }),
    });

    this.venmo = new PromisedSingleton<braintree.Venmo>({
      generator: this.loadBraintreeScript('venmo').then(() => {
        return window.braintree.venmo;
      }),
    });

    this.payPal = new PromisedSingleton<braintree.PayPalCheckout>({
      generator: this.loadBraintreeScript('paypal-checkout').then(() => {
        return window.braintree.paypalCheckout;
      }),
    });

    this.applePay = new PromisedSingleton<braintree.ApplePay>({
      generator: this.loadBraintreeScript('apple-pay').then(() => {
        return window.braintree.applePay;
      }),
    });

    this.googlePayBraintreeClient = new PromisedSingleton<braintree.GooglePayment>({
      generator: this.loadBraintreeScript('google-payment').then(() => {
        return window.braintree.googlePayment;
      }),
    });

    this.googlePaymentsClient = new PromisedSingleton<google.payments.api.PaymentsClient>({
      generator: this.lazyLoader
        .loadScript({ src: 'https://pay.google.com/gp/p/js/pay.js' })
        .then(() => {
          return new google.payments.api.PaymentsClient({
            environment:
              this.environment === HostingEnvironment.Development ? 'TEST' : 'PRODUCTION',
          });
        }),
    });

    this.recaptchaLibrary = new PromisedSingleton<ReCaptchaV2.ReCaptcha>({
      generator: new Promise(resolve => {
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
          src:
            'https://www.google.com/recaptcha/api.js?onload=donationFormGrecaptchaLoadedCallback&render=explicit',
        });
      }),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.paypalLibrary = new PromisedSingleton<any>({
      generator: this.lazyLoader
        .loadScript({
          src: 'https://www.paypalobjects.com/api/checkout.js',
          attributes: [
            { key: 'data-version-4', value: '' },
            { key: 'log-level', value: 'warn' },
          ],
        })
        .then(() => {
          return window.paypal;
        }),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async loadBraintreeScript(scriptName: string): Promise<any> {
    const extension = this.environment === HostingEnvironment.Production ? 'min.js' : 'js';
    const scriptWithSuffix = `${scriptName}.${extension}`;
    const url = `https://js.braintreegateway.com/web/${this.braintreeVersion}/js/${scriptWithSuffix}`;
    return this.lazyLoader.loadScript({ src: url });
  }

  private braintreeVersion = '3.62.2';

  private environment: HostingEnvironment = HostingEnvironment.Development;

  private lazyLoader: LazyLoaderServiceInterface;
}