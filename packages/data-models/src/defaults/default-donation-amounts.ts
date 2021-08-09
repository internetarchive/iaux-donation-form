import { DonationPaymentInfo } from "../donation-info/donation-payment-info"
import { DonationType } from "../donation-info/donation-type";

// the default donation amounts to show in the donation amount selector
export const defaultDonationAmounts: number[] = [
  5,
  10,
  25,
  50,
  100,
  500,
  1000,
]

// the default amount selected
export const defaultSelectedDonationInfo: DonationPaymentInfo = new DonationPaymentInfo({
  donationType: DonationType.OneTime,
  amount: 5,
  coverFees: false,
});
