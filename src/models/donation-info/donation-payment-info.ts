import { DonationType } from './donation-type';

export class DonationPaymentInfo {
  donationType: DonationType;
  amount: number;
  coverFees: boolean;

  get feeAmountCovered(): number {
    return this.coverFees ? this.fee : 0;
  }

  get fee(): number {
    return DonationPaymentInfo.calculateFeeAmount(this.amount);
  }

  get total(): number {
    return DonationPaymentInfo.calculateTotal(this.amount, this.coverFees);
  }

  static calculateTotal(amount: number, coverFees: boolean): number {
    const fee = coverFees ? this.calculateFeeAmount(amount) : 0;
    const total = amount + fee;
    return isNaN(total) ? 0 : total;
  }

  static calculateFeeAmount(amount: number): number {
    const fee = amount * 0.022 + 0.3;
    return isNaN(fee) ? 0 : fee;
  }

  static get default(): DonationPaymentInfo {
    return new DonationPaymentInfo({
      donationType: DonationType.OneTime,
      amount: 5,
      coverFees: false,
    });
  }

  constructor(params: { donationType: DonationType; amount: number; coverFees: boolean }) {
    this.donationType = params.donationType;
    this.amount = params.amount;
    this.coverFees = params.coverFees;
  }
}
