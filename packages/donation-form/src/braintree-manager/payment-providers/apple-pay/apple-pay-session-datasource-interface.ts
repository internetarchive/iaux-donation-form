import { ApplePaySessionDataSourceDelegate } from './apple-pay-session-datasource-delegate';

export interface ApplePaySessionDataSourceInterface {
  delegate?: ApplePaySessionDataSourceDelegate;
  onvalidatemerchant(event: ApplePayJS.ApplePayValidateMerchantEvent): Promise<void>;
  onpaymentauthorized(event: ApplePayJS.ApplePayPaymentAuthorizedEvent): Promise<void>;
  oncancel(): Promise<void>;
}
