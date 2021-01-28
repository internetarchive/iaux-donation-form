import { DonationPaymentInfo, DonationType } from '@internetarchive/donation-form-data-models';
import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';
import currency from 'currency.js';

@customElement('donation-form-total-amount')
export class TotalAmount extends LitElement {
  @property({ type: Object })
  donationInfo?: DonationPaymentInfo;

  render(): TemplateResult {
    return html`
      <div class="top-line"></div>
      <div class="total-line">Total: ${this.totalAmount}</div>
    `;
  }

  private get totalAmount(): string | undefined {
    if (!this.donationInfo) return;
    const amount = currency(this.donationInfo.total, { symbol: '$' }).format();
    const monthly = this.donationInfo.donationType === DonationType.Monthly ? '/month' : '';
    return `${amount}${monthly}`;
  }

  static get styles(): CSSResult {
    const lineColor = css`var(--totalAmountLineColor, #333)`;

    return css`
      .top-line {
        width: 100%;
        height: 2px;
        background-color: ${lineColor};
      }

      .total-line {
        font-size: 2.6rem;
        font-weight: bold;
        text-align: center;
        margin-top: 0.8rem;
      }
    `;
  }
}
