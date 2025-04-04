import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DonationType } from '@internetarchive/donation-form-data-models';
import currency from 'currency.js';

/**
 * This is the content that we show in the upsell modal.
 *
 * It has an amount input, "Yes" and "No Thanks" options and a switch to optionally
 * show the PayPal upsell button.
 *
 * @export
 * @class ConfirmDonationContent
 * @extends {LitElement}
 */
@customElement('confirm-donation-modal')
export class ConfirmDonationContent extends LitElement {
  @property({ type: Number }) amount = 5;

  @property({ type: String }) currencyType = '$';

  @property({ type: String }) donationType: DonationType = DonationType.OneTime;

  @property({ type: Function }) confirmDonation: Function = (): void => {};

  @property({ type: Function }) cancelDonation: Function = (): void => {};

  get confirmationText(): TemplateResult {
    const amount = currency(this.amount, { symbol: this.currencySymbol }).format();
    return html`
      <p>
        You are about to make a <b>${this.donationType}</b> donation of
        <b>${amount} ${this.currencyType}</b> to the Internet Archive.
      </p>
    `;
  }

  get confirmUpsellText(): TemplateResult {
    const amount = currency(this.amount, { symbol: this.currencySymbol }).format();
    return html`<p>
      You are about to begin making <b>monthly</b> donations of
      <b>${amount} ${this.currencyType}</b> to the Internet Archive. (Your first recurring
      contribution will be next month.)
    </p>`;
  }

  confirm(): void {
    this?.confirmDonation();
  }

  cancel(): void {
    this?.cancelDonation();
  }

  get confirmCTA(): string {
    return this.donationType === DonationType.Upsell
      ? 'Start monthly donation'
      : 'Complete donation';
  }

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      ${this.donationType === DonationType.Upsell ? this.confirmUpsellText : this.confirmationText}

      <div class="cta-group">
        <button id="confirm" @click=${(): void => this.confirm()}>${this.confirmCTA}</button>
        <button id="cancel" @click=${(): void => this.cancel()}>Cancel</button>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    const ctaButtonColor = css`var(--upsellCTAButtonColor, #194880)`;
    const ctaButtonDisabledColor = css`var(--upsellCTAButtonDisabledColor, rgba(109,148,201,0.5))`;

    return css`
      :host {
        display: block;
      }

      button {
        outline: none;
        cursor: pointer;
      }

      button#confirm {
        font-size: 2rem;
        display: block;
        width: 100%;
        margin-top: 0.5rem;
        padding: 1rem 2rem;
        background-color: ${ctaButtonColor};
        color: #fff;
        border-radius: 5px;
        border: 0;
        font-weight: bold;
        line-height: normal;
      }

      button#cancel {
        margin-top: 1rem;
        border: 0;
        text-decoration: underline;
        background-color: transparent;
      }

      button:disabled {
        background-color: ${ctaButtonDisabledColor};
        cursor: not-allowed;
      }
    }`;
  }

  /**
   * https://developer.paypal.com/docs/reports/reference/paypal-supported-currencies/
   */
  get currencySymbol(): string {
    switch (this.currencyType) {
      case 'AUD':
        return 'AU$';
      case 'BRL':
        return 'R$';
      case 'CAD':
        return 'CA$';
      case 'CHF':
        return 'Fr';
      case 'CNY':
        return '¥';
      case 'CZK':
        return 'Kč';
      case 'DKK':
        return 'Kr';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'HKD':
        return 'HK$';
      case 'HUF':
        return 'Ft';
      case 'ILS':
        return '₪';
      case 'JPY':
        return '¥';
      case 'MXN':
        return 'MX$';
      case 'MYR':
        return 'RM';
      case 'NOK':
        return 'kr';
      case 'PLN':
        return 'zł';
      case 'RUB':
        return '₽';
      case 'SEK':
        return 'kr';
      case 'SGD':
        return 'S$';
      case 'THB':
        return '฿';
      case 'TYD':
        return 'NT$';
      default:
        return '$'; // $ as default USD, NZD
    }
  }
}
