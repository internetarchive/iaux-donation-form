import { expect } from '@open-wc/testing';
import { DonationPaymentInfo, DonationType } from '@internetarchive/donation-form-data-models';

// this is a separate calculation from the one in DonationPaymentInfo
// to have a second verification independent of it
function calculateFee(amount: number): number {
  return Math.round((amount * 0.02 + 0.49) * 100) / 100;
}

describe('Donation Payment Info', () => {
  it('calculates the proper total for no fees covered', async () => {
    const donationInfo = new DonationPaymentInfo({
      donationType: DonationType.OneTime,
      amount: 3.5,
      coverFees: false,
    });

    expect(donationInfo.total).to.equal(3.5);
  });

  it('calculates the proper total for fees coverage', async () => {
    const baseAmount = 3.5;
    const expectedFee = calculateFee(baseAmount);
    const expectedTotal = Math.round((baseAmount + expectedFee) * 100) / 100;

    const donationInfo = new DonationPaymentInfo({
      donationType: DonationType.OneTime,
      amount: baseAmount,
      coverFees: true,
    });

    expect(donationInfo.total).to.equal(expectedTotal);
  });

  it('calculates the proper expected fees from manual calculations', async () => {
    const donationInfo = new DonationPaymentInfo({
      donationType: DonationType.OneTime,
      amount: 5,
      coverFees: true,
    });
    expect(donationInfo.fee).to.equal(0.59);
    expect(donationInfo.total).to.equal(5.59);

    donationInfo.amount = 3.5;
    expect(donationInfo.fee).to.equal(0.56);
    expect(donationInfo.total).to.equal(4.06);
  });

  it('calculates the proper expected fees', async () => {
    const baseAmount = 3.23;
    const expectedFee = calculateFee(baseAmount);
    const calculatedFee = DonationPaymentInfo.calculateFeeAmount(baseAmount);
    expect(expectedFee).to.equal(calculatedFee);
  });

  it('get the proper fee amount covered when covering fees', async () => {
    const baseAmount = 4.12;
    const expectedFee = calculateFee(baseAmount);
    const donationInfo = new DonationPaymentInfo({
      donationType: DonationType.OneTime,
      amount: baseAmount,
      coverFees: true,
    });

    expect(donationInfo.feeAmountCovered).to.equal(expectedFee);
  });

  it('get the proper fee amount covered when not covering fees', async () => {
    const baseAmount = 4.12;
    // const expectedFee = calculateFee(baseAmount);
    const donationInfo = new DonationPaymentInfo({
      donationType: DonationType.OneTime,
      amount: baseAmount,
      coverFees: false,
    });

    expect(donationInfo.feeAmountCovered).to.equal(0);
  });

  it('calculates the proper expected total', async () => {
    const baseAmount = 3.29;
    const expectedFee = calculateFee(baseAmount);
    const expectedTotal = baseAmount + expectedFee;
    const calculatedTotal = DonationPaymentInfo.calculateTotal(baseAmount, true);
    expect(expectedTotal).to.equal(calculatedTotal);
  });
});
