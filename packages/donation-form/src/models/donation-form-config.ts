export class DonationFormConfig {
  showCreditCardButtonText: boolean;

  constructor(options: { showCreditCardButtonText: boolean }) {
    this.showCreditCardButtonText = options.showCreditCardButtonText;
  }
}
