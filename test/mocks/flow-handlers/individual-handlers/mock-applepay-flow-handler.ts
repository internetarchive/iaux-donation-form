import { ApplePayFlowHandlerInterface } from '../../../../src/payment-flow-handlers/handlers/applepay-flow-handler';
import { DonationPaymentInfo } from '../../../../src/models/donation-info/donation-payment-info';

export class MockApplePayFlowHandler implements ApplePayFlowHandlerInterface {
  paymentInitiatedDonationInfo?: DonationPaymentInfo;
  paymentInitiatedEvent?: Event;

  async paymentInitiated(donationInfo: DonationPaymentInfo, e: Event): Promise<void> {
    this.paymentInitiatedDonationInfo = donationInfo;
    this.paymentInitiatedEvent = e;
  }
}
