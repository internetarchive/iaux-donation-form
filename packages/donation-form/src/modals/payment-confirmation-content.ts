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

  @property({ type: String }) currencyType = '$';

  @property({ type: String }) donationType: DonationType = DonationType.OneTime;

  get confirmationText(): string {
    return `You are about to make a ${this.donationType} donation of ${this.currencySymbol}${this.amount}${this.currencyType} to the Internet Archive`;
  }

  get currencySymbol(): string {
    switch(this.currencyType) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'JPY':
        return '¥';
      case 'CAD':
        return '$';
      case 'AUD':
        return '$';
      case 'NZD':
        return '$';
      default:
        return '$';
    }
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
      <p>${this.confirmationText}</p>

      <div class="cta-group">
        <button @click=${(e: Event) => this.donationConfirmed(e)}>COMPLETE DONATION</button>
        <button @click=${(e: Event) => this.donationCancelled(e)}>Cancel</button>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem;
      }
      button {
        font-size: 2rem;
        display: block;
        width: 100%;
        margin-top: 0.5rem;
        padding: 1rem 2rem;
        background-color: rebeccapurple;
        color: #fff;
        border-radius: 5px;
        border: 0;
        font-weight: bold;
        line-height: normal;
        outline: none;
        cursor: pointer;
      }

      button:disabled {
        background-color: blue;
        cursor: not-allowed;
      }
    }`;
  }
}
