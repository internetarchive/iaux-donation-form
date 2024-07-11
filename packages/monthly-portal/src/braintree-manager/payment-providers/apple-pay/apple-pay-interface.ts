import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { DonationPaymentInfo } from '@internetarchive/donation-form-data-models';
import { ApplePaySessionDataSourceInterface } from './apple-pay-session-datasource-interface';

export interface ApplePayHandlerInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: PromisedSingleton<any | undefined>;
  isAvailable(): Promise<boolean>;
  createPaymentRequest(
    e: Event,
    donationInfo: DonationPaymentInfo,
  ): Promise<ApplePaySessionDataSourceInterface>;
}
