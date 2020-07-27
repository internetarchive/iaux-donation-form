import { PromisedSingleton } from '@internetarchive/promised-singleton';

import { BraintreeManagerInterface } from '../braintree-interfaces';

export interface VenmoHandlerInterface {
  instance: PromisedSingleton<braintree.Venmo>;

  isBrowserSupported(): Promise<boolean>;
  startPayment(): Promise<braintree.VenmoTokenizePayload>;
}

export class VenmoHandler implements VenmoHandlerInterface {
  instance: PromisedSingleton<braintree.Venmo>;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    venmoClient: braintree.Venmo;
    venmoProfileId: string;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.venmoClient = options.venmoClient;
    this.venmoProfileId = options.venmoProfileId;

    this.instance = new PromisedSingleton<braintree.Venmo>({
      generator: this.braintreeManager.instance.get().then(braintreeInstance => {
        return this.venmoClient.create({
          client: braintreeInstance,
          profileId: this.venmoProfileId,
        });
      }),
    });
  }

  private braintreeManager: BraintreeManagerInterface;

  private venmoClient: braintree.Venmo;

  private venmoProfileId: string;

  async isBrowserSupported(): Promise<boolean> {
    if (this.isMobileFirefox()) {
      return false;
    }
    const instance = await this.instance.get();
    return instance?.isBrowserSupported() ?? false;
  }

  async startPayment(): Promise<braintree.VenmoTokenizePayload> {
    const instance = await this.instance.get();
    return instance?.tokenize();
  }

  /**
   * Venmo does not work in mobile Firefox, but their browser detector returns supported for it.
   *
   * On iOS, it opens the Venmo app, but returns you to Safari.
   * On Android, it takes you to the "Download Venmo" page.
   *
   * @private
   * @returns {boolean}
   * @memberof VenmoHandler
   */
  private isMobileFirefox(): boolean {
    const isFirefoxIos = navigator.userAgent.indexOf('FxiOS') !== -1;
    const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
    const isMobile = navigator.userAgent.indexOf('Mobile') !== -1;
    return (isFirefox || isFirefoxIos) && isMobile;
  }
}
