/* eslint-disable @typescript-eslint/no-empty-function */
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

  @property({ type: Function }) donationCancelled: Function = (): void => {};

  @property({ type: Function }) donationConfirmed: Function= (): void => {};

  get confirmationText(): string {
    const amount = currency(this.amount, { symbol: this.currencySymbol }).format();

    return `You are about to make a ${this.donationType} donation of ${amount} to the Internet Archive`;
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

  confirm(e: Event): void {
    console.log('donationConfirmed --- ', e);
    this?.donationConfirmed();
  }

  cancel(e: Event): void {
    console.log('donationCancelled --- ', e);
    this?.donationCancelled();
  }

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <p>${this.confirmationText}</p>

      <div class="cta-group">
        <button id="confirm" @click=${(e: Event): void => this.confirm(e)}>COMPLETE DONATION</button>
        <button id="cancel" @click=${(e: Event): void => this.cancel(e)}>Cancel</button>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    const ctaButtonColor = css`var(--upsellCTAButtonColor, #194880)`;
    const ctaButtonDisabledColor = css`var(--upsellCTAButtonDisabledColor, rgba(109,148,201,0.5))`;

    return css`
      :host {
        display: block;
        padding: 1rem;
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
      }

      button:disabled {
        background-color: ${ctaButtonDisabledColor};
        cursor: not-allowed;
      }
    }`;
  }
}
