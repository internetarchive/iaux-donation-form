import { DonationType } from '../../src/models/donation-info/donation-type';
import { DonationPaymentInfo } from '../../src/models/donation-info/donation-payment-info';

export class MockDonationInfo extends DonationPaymentInfo {
  constructor() {
    super({
      donationType: DonationType.OneTime,
      amount: 5,
      coverFees: false,
    });
  }
}
