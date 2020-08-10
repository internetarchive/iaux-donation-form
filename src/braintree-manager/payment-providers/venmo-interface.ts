import { PromisedSingleton } from '@internetarchive/promised-singleton';

export interface VenmoHandlerInterface {
  instance: PromisedSingleton<braintree.Venmo>;

  isBrowserSupported(): Promise<boolean>;
  startPayment(): Promise<braintree.VenmoTokenizePayload>;
}
