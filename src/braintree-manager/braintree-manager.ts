import { DonationResponse } from '../models/response-models/donation-response';
import { DonationRequest } from '../models/request_models/donation-request';
import { PaymentProvidersInterface, PaymentProviders } from './payment-providers';
import { PaymentClientsInterface } from './payment-clients';
import { BraintreeManagerInterface, BraintreeEndpointManagerInterface, HostingEnvironment } from './braintree-interfaces';

export class BraintreeManager implements BraintreeManagerInterface {
  get deviceData(): string | undefined {
    return this._deviceData;
  }

  private _deviceData?: string;

  /**
   * This contains all of the individual payment providers so as to not clutter the
   * top-level BraintreeManager class.
   *
   * @type {PaymentProvidersInterface}
   * @memberof BraintreeManager
   */
  paymentProviders: PaymentProvidersInterface;

  async startup(): Promise<void> {
    console.debug('braintree startup');
    this.collectDeviceData();
  }

  async getInstance(): Promise<braintree.Client | undefined> {
    if (this.braintreeInstance) {
      return this.braintreeInstance;
    }

    return new Promise((resolve, reject) => {
      this.paymentClients.getBraintreeClient().then((client?: braintree.Client) => {
        client?.create({
          authorization: this.authorizationToken
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, (clientErr: any | undefined, clientInstance: braintree.Client | undefined) => {
          if (clientErr) {
            return reject(clientErr);
          }
          this.braintreeInstance = clientInstance;
          resolve(clientInstance);
        });
      });
    });
  }

  async submitDataToEndpoint(request: DonationRequest): Promise<DonationResponse> {
    const jsonResponse = await this.endpointManager.submitData(request);
    const modeledResponse = new DonationResponse(jsonResponse);
    return modeledResponse;
  }

  private async collectDeviceData(): Promise<void> {
    const instance = await this.getInstance();
    if (!instance) { return; }

    console.debug('collectDeviceData, starting dataCollector');
    this.paymentClients.getDataCollector().then((collector?: braintree.DataCollector) => {
      collector?.create({
        client: instance,
        kount: false,
        paypal: true
      }, (error?: braintree.BraintreeError, instance?: braintree.DataCollector) => {
        if (error) {
          console.error(error);
          return;
        }
        console.debug('dataCollector started', instance?.deviceData);
        this._deviceData = instance?.deviceData;
      });
    });
  }

  private authorizationToken: string;

  private braintreeInstance: braintree.Client | undefined;

  private endpointManager: BraintreeEndpointManagerInterface;

  private paymentClients: PaymentClientsInterface;

  private hostingEnvironment: HostingEnvironment = HostingEnvironment.Development;

  constructor(options: {
    paymentClients: PaymentClientsInterface;
    endpointManager: BraintreeEndpointManagerInterface;
    authorizationToken: string;
    venmoProfileId?: string;
    googlePayMerchantId?: string;
    hostedFieldStyle: object;
    hostedFieldConfig: braintree.HostedFieldFieldOptions;
    hostingEnvironment: HostingEnvironment;
  }) {
    this.authorizationToken = options.authorizationToken;
    this.endpointManager = options.endpointManager;
    this.hostingEnvironment = options.hostingEnvironment;
    this.paymentClients = options.paymentClients;

    this.paymentProviders = new PaymentProviders({
      braintreeManager: this,
      paymentClients: this.paymentClients,
      venmoProfileId: options.venmoProfileId,
      googlePayMerchantId: options.googlePayMerchantId,
      hostingEnvironment: options.hostingEnvironment,
      hostedFieldStyle: options.hostedFieldStyle,
      hostedFieldConfig: options.hostedFieldConfig
    });
  }
}
