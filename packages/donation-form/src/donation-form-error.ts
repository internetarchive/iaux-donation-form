export class DonationFormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DonationFormError';
  }
}
