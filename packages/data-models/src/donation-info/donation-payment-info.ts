import { DonationType } from './donation-type';

/**
 * DonationPaymentInfo contains everything needed to represent and calculate donation amounts.
 *
 * Given an amount and whether the user is covering feeds, it can calculate the amount of the
 * fee and the total amount, rounded appropriately.
 *
 * It also carries the DonationType: one-time, monthly, or upsell
 *
 * @export
 * @class DonationPaymentInfo
 */
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

  /**
   * Calculate the total for a given amount and fees.
   *
   * Rounds to the nearest cent.
   *
   * @static
   * @param {number} amount
   * @param {boolean} coverFees
   * @returns {number}
   * @memberof DonationPaymentInfo
   */
  static calculateTotal(amount: number, coverFees: boolean): number {
    const fee = coverFees ? this.calculateFeeAmount(amount) : 0;
    const total = amount + fee;
    if (isNaN(total)) {
      return 0;
    }
    const roundedValue = this.roundAmount(total);
    return roundedValue;
  }

  /**
   * Calculate the fee for a given amount.
   *
   * Rounds to the nearest cent.
   *
   * @static
   * @param {number} amount
   * @returns {number}
   * @memberof DonationPaymentInfo
   */
  static calculateFeeAmount(amount: number): number {
    const fee = amount * 0.02 + 0.49;
    if (isNaN(fee)) {
      return 0;
    }
    const currencyValue = this.roundAmount(fee);
    return currencyValue;
  }

  /**
   * Round the amount to closest cent
   *
   * @private
   * @static
   * @param {number} amount
   * @returns {number}
   * @memberof DonationPaymentInfo
   */
  private static roundAmount(amount: number): number {
    return Math.round(amount * 100) / 100;
  }

  constructor(params: {
    donationType: DonationType;
    amount: number;
    coverFees: boolean;
  }) {
    this.donationType = params.donationType;
    this.amount = params.amount;
    this.coverFees = params.coverFees;
  }
}
