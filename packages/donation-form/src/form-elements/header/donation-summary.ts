import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import currency from 'currency.js';

import { DonationType, DonationPaymentInfo } from '@internetarchive/donation-form-data-models';

@customElement('donation-summary')
export class DonationSummary extends LitElement {
  @property({ type: Object }) donationInfo?: DonationPaymentInfo;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <h1>${this.displayTitle}</h1>
      <button @click=${this.editClicked}>Edit this amount</button>
    `;
  }

  get displayTitle(): string {
    if (!this.donationInfo) {
      return '';
    }

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
