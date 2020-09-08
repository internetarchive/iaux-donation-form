import { VenmoFlowHandlerInterface } from '../../../../src/payment-flow-handlers/handlers/venmo-flow-handler';
import { DonorContactInfo } from '../../../../src/models/common/donor-contact-info';
import { DonationPaymentInfo } from '../../../../src/models/donation-info/donation-payment-info';

export class MockVenmoFlowHandler implements VenmoFlowHandlerInterface {
  startupCalled = false;

  paymentInitiatedDonationInfo?: DonationPaymentInfo;
  paymentInitiatedDonorInfo?: DonorContactInfo;

  async startup(): Promise<void> {
    this.startupCalled = true;
  }

  async paymentInitiated(
    contactInfo: DonorContactInfo,
    donationInfo: DonationPaymentInfo,
  ): Promise<void> {
    this.paymentInitiatedDonationInfo = donationInfo;
    this.paymentInitiatedDonorInfo = contactInfo;
  }
}
