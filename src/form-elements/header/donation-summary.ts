import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
} from 'lit-element';

import currency from 'currency.js';

import { DonationType } from '../../models/donation-info/donation-type';
import { DonationPaymentInfo } from '../../models/donation-info/donation-payment-info';

@customElement('donation-summary')
export class DonationSummary extends LitElement {
  @property({ type: Object }) donationInfo: DonationPaymentInfo = DonationPaymentInfo.default;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <h1>${this.displayTitle}</h1>
      <button @click=${this.editClicked}>Edit this amount</button>
    `;
  }

  get displayTitle(): string {
    const monthlyString = this.donationInfo.donationType === DonationType.Monthly ? 'Monthly' : '';
    const amount = this.donationInfo.amount;
    let precision = 2;
    // whole number, don't use decimals
    if (amount === Math.round(amount)) {
      precision = 0;
    }

    const displayAmount = currency(this.donationInfo.amount, {
      symbol: '$',
      precision: precision,
    }).format();

    return `${displayAmount} ${monthlyString} Donation`;
  }

  private editClicked(): void {
    this.dispatchEvent(new Event('editClicked'));
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    return css`
      :host {
        display: flex;
        justify-content: center;
        align-content: center;
      }

      button {
        border: 0;
        background: none;
        color: blue;
      }
    `;
  }
}
