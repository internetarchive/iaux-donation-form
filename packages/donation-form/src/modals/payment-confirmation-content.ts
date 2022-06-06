import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DonationType } from '@internetarchive/donation-form-data-models';

/**
 * This is the content that we show in the upsell modal.
 *
 * It has an amount input, "Yes" and "No Thanks" options and a switch to optionally
 * show the PayPal upsell button.
 *
 * @export
 * @class PaymentConfirmationContent
 * @extends {LitElement}
 */
@customElement('payment-confirmation-modal')
export class PaymentConfirmationContent extends LitElement {
  @property({ type: Number }) amount = 5;

  @property({ type: String }) currency = '$';

  @property({ type: String }) donationType: DonationType = DonationType.OneTime;

  get confirmationText(): string {
    return `You are about to make a ${this.donationType} donation of ${this.amount} to the Internet Archive`;
  }

  donationConfirmed(e: Event): void {
    console.log('donationConfirmed --- ', e);
  }

  donationCancelled(e: Event): void {
    console.log('donationCancelled --- ', e);
  }

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <h3>Confirm:</h3>
      <p>${this.confirmationText}</p>
      <button @click=${(e: Event) => this.donationConfirmed(e)}>COMPLETE DONATION</button>
      <button @click=${(e: Event) => this.donationCancelled(e)}>Cancel</button>
    `;
  }
}