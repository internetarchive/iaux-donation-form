import { DonationResponse } from '../../../models/response-models/donation-response';

export interface ApplePaySessionDataSourceDelegate {
  paymentComplete(response: DonationResponse): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentFailed(error: any): void;
  paymentCancelled(): void;
}
