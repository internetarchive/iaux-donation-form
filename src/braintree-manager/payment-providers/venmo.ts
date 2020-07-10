import { BraintreeManagerInterface } from '../braintree-interfaces';

export interface VenmoHandlerInterface {
  isBrowserSupported(): Promise<boolean>;
  getInstance(): Promise<braintree.Venmo>;
  startPayment(): Promise<braintree.VenmoTokenizePayload>;
}

export class VenmoHandler implements VenmoHandlerInterface {
  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    venmoClient: braintree.Venmo;
    venmoProfileId: string;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.venmoClient = options.venmoClient;
    this.venmoProfileId = options.venmoProfileId;
  }

  private braintreeManager: BraintreeManagerInterface;

  private venmoClient: braintree.Venmo;

  private venmoProfileId: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private venmoInstance?: any;

  private venmoInstancePromise?: Promise<braintree.Venmo>;

  async isBrowserSupported(): Promise<boolean> {
    const instance = await this.getInstance();
    return instance?.isBrowserSupported() ?? false;
  }

  async getInstance(): Promise<braintree.Venmo> {
    if (this.venmoInstance) {
      return this.venmoInstance;
    }

    // we only want one instance of this to be created so this chains the promise
    // calls if multiple callers request the instance
    if (this.venmoInstancePromise) {
      this.venmoInstancePromise = this.venmoInstancePromise.then(handler => { return handler });
      return this.venmoInstancePromise;
    }

    this.venmoInstancePromise = this.braintreeManager.getInstance()
      .then(braintreeInstance => {
        return this.venmoClient.create({
          client: braintreeInstance,
          profileId: this.venmoProfileId,
        });
      })
      .then(instance => {
        this.venmoInstance = instance;
        return instance;
      });

    return this.venmoInstancePromise
  }

  async startPayment(): Promise<braintree.VenmoTokenizePayload> {
    const instance = await this.getInstance();
    return instance?.tokenize();
  }
}
