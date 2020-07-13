import { BraintreeManagerInterface } from '../braintree-interfaces';
import { PromisedSingleton } from '../../util/promised-singleton';

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

    this.instance = new PromisedSingleton<braintree.Venmo>(
      this.braintreeManager.instance.get().then(braintreeInstance => {
        return this.venmoClient.create({
          client: braintreeInstance,
          profileId: this.venmoProfileId,
        });
      }),
    );
  }

  private braintreeManager: BraintreeManagerInterface;

  private venmoClient: braintree.Venmo;

  private venmoProfileId: string;

  async isBrowserSupported(): Promise<boolean> {
    const instance = await this.instance.get();
    return instance?.isBrowserSupported() ?? false;
  }

  async startPayment(): Promise<braintree.VenmoTokenizePayload> {
    const instance = await this.instance.get();
    return instance?.tokenize();
  }
}
