import { BraintreeManagerInterface } from "../braintree-interfaces";

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

  async isBrowserSupported(): Promise<boolean> {
    const instance = await this.getInstance();
    return instance?.isBrowserSupported() ?? false;
  }

  async getInstance(): Promise<braintree.Venmo> {
    if (this.venmoInstance) {
      return this.venmoInstance;
    }

    const braintreeInstance = await this.braintreeManager.getInstance();

    return new Promise((resolve, reject) => {
      this.venmoClient.create({
        client: braintreeInstance,
        profileId: this.venmoProfileId
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, (error: any, instance: braintree.Venmo) => {
        if (error) {
          return reject(error);
        }

        this.venmoInstance = instance;
        resolve(instance);
      });
    });
  }

  async startPayment(): Promise<braintree.VenmoTokenizePayload> {
    const instance = await this.getInstance();
    return instance?.tokenize();
  }
}
