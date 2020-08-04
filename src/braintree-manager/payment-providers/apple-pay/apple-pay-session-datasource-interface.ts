import { DonationPaymentInfo } from '../../../models/donation-info/donation-payment-info';
import { ApplePaySessionDataSourceDelegate } from './apple-pay-session-datasource-delegate';

export interface ApplePaySessionDataSourceInterface {
  delegate?: ApplePaySessionDataSourceDelegate;
  donationInfo: DonationPaymentInfo;
  onvalidatemerchant(event: ApplePayJS.ApplePayValidateMerchantEvent): Promise<void>;
  onpaymentauthorized(event: ApplePayJS.ApplePayPaymentAuthorizedEvent): Promise<void>;
  oncancel(): Promise<void>;
}
