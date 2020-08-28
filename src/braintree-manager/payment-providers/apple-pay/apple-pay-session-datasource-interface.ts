import { DonationPaymentInfo } from '@internetarchive/donation-form-data-models';
import { ApplePaySessionDataSourceDelegate } from './apple-pay-session-datasource-delegate';

export interface ApplePaySessionDataSourceInterface {
  delegate?: ApplePaySessionDataSourceDelegate;
  donationInfo: DonationPaymentInfo;
  onvalidatemerchant(event: ApplePayJS.ApplePayValidateMerchantEvent): Promise<void>;
  onpaymentauthorized(event: ApplePayJS.ApplePayPaymentAuthorizedEvent): Promise<void>;
  oncancel(): Promise<void>;
}
