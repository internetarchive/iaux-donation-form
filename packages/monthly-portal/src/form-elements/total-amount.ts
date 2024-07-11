import { DonationPaymentInfo, DonationType } from '@internetarchive/donation-form-data-models';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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
    const lineThickness = css`var(--totalAmountLineThickness, 2px)`;
    const totalAmountVerticalSpacing = css`var(--totalAmountVerticalSpacing, 0.5rem)`;
    const totalAmountFontSize = css`var(--totalAmountFontSize, 2.6rem)`;

    return css`
      .top-line {
        width: 100%;
        height: ${lineThickness};
        background-color: ${lineColor};
      }

      .total-line {
        font-size: ${totalAmountFontSize};
        font-weight: bold;
        text-align: center;
        margin-top: ${totalAmountVerticalSpacing};
      }
    `;
  }
}
