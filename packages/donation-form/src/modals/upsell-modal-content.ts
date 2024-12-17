import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CurrencyValidator } from '@internetarchive/donation-form-currency-validator';

export enum UpsellModalCTAMode {
  YesButton = 'YesButton',
  PayPalUpsellSlot = 'PayPalUpsellSlot',
}

/**
 * This is the content that we show in the upsell modal.
 *
 * It has an amount input, "Yes" and "No Thanks" options and a switch to optionally
 * show the PayPal upsell button.
 *
 * @export
 * @class UpsellModalContent
 * @extends {LitElement}
 */
@customElement('upsell-modal-content')
export class UpsellModalContent extends LitElement {
  @property({ type: String }) yesButtonMode: UpsellModalCTAMode = UpsellModalCTAMode.YesButton;

  @property({ type: Number }) amount = 5;

  @property({ type: Object }) error?: TemplateResult;

  @query('#amount-input') amountInput!: HTMLInputElement;

  private currencyValidator: CurrencyValidator = new CurrencyValidator();

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <h3>Thank you for donating!</h3>
      <button @click=${this.noThanksSelected} class="cta-button" id="no-button">Continue</button>
      <p class="or_separator"><span>or</span></p>
      <h3>Join our Monthly Giving Circle</h3>
      <p class="appeal">Monthly support helps us reliably plan for the future.</p>
      <div class="monthly-amount">
        <h1>Enter your monthly amount</h1>
        <div class="amount-input">
          <span class="dollar-symbol">$</span>
          <input
            id="amount-input"
            type="text"
            tabindex="0"
            value=${this.amount}
            @input=${this.amountChanged}
            @keydown=${this.currencyValidator.keydown}
          />
        </div>
        <div class="error ${this.error ? '' : 'hidden'}">${this.error}</div>
      </div>

      ${this.yesButton}
    `;
  }

  private get yesButton(): TemplateResult {
    switch (this.yesButtonMode) {
      case UpsellModalCTAMode.YesButton:
        return html`
          <button
            class="cta-button"
            tabindex="0"
            id="yes-button"
            @click=${this.yesSelected}
            .disabled=${this.error !== undefined}
          >
            YES, I'll donate monthly
          </button>
        `;
      case UpsellModalCTAMode.PayPalUpsellSlot:
        return html`
          <div class="paypal-upsell-slot-container">
            <div class="paypal-upsell-slot-blocker ${this.error ? '' : 'hidden'}"></div>
            <button class="cta-button" id="paypal-cover-button">YES, I'll donate monthly</button>
            <slot class="paypal-upsell-slot"></slot>
          </div>
        `;
    }
  }

  private amountChanged(e: Event): void {
    const target = e.target as HTMLInputElement;
    const amount = target.value;
    if (amount.length === 0) {
      return;
    }
    this.handleCustomAmountInput(amount);
  }

  private handleCustomAmountInput(value: string): void {
    const amount = parseFloat(value);
    if (isNaN(amount)) {
      this.error = html` Please enter a valid amount. `;
    } else {
      this.processAmount(amount);
    }
  }

  private processAmount(amount: number): void {
    if (amount >= 10000) {
      this.error = html`
        To make a donation of $10,000 or more, please contact our philanthropy department at
        <a href="mailto:donations@archive.org">donations@archive.org</a>
      `;
      return;
    }

    if (amount < 1) {
      if (this.amountInput && this.amountInput.value.length > 0) {
        this.error = html` The minimum donation amount is $1. `;
      }
      return;
    }

    this.error = undefined;

    this.amount = amount;

    const event = new CustomEvent('amountChanged', { detail: { amount: this.amount } });
    this.dispatchEvent(event);
  }

  private yesSelected(): void {
    const event = new CustomEvent('yesSelected', { detail: { amount: this.amount } });
    this.dispatchEvent(event);
  }

  private noThanksSelected(): void {
    this.dispatchEvent(new Event('noThanksSelected'));
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const ctaButtonColor = css`var(--upsellCTAButtonColor, #194880)`;
    const ctaButtonDisabledColor = css`var(--upsellCTAButtonDisabledColor, rgba(109,148,201,0.5))`;
    const amountInputOffset = css`var(--upsellAmountInputOffset, -1rem)`;

    return css`
      .monthly-amount {
        background-color: #fff;
        padding: 0.5rem 0.625rem;
        border-radius: 5px;
        text-align: center;
        margin-bottom: 0.5rem;
        margin-top: 0;
      }

      .monthly-amount h1 {
        font-size: 1.8rem;
        font-weight: bold;
        text-align: center;
        line-height: 1.2em;
        margin: 0;
        padding: 0.5rem 0 0 0;
      }

      .hidden {
        display: none;
      }

      h3 {
        text-align: center;
        font-size: 1.8rem;
        margin: 0 1rem 0.5rem 1rem;
      }

      .appeal {
        text-align: center;
        font-size: 1.6rem;
        margin: 0.5rem 1rem;
      }

      .amount-input {
        transform: translate(${amountInputOffset}, 0); /* translate slightly to center the input */
      }

      .amount-input .dollar-symbol {
        font-size: 1.8rem;
        font-weight: bold;
      }

      .amount-input input {
        width: 100px;
        text-align: center;
        border: none;
        border-bottom: 1px solid gray;
        font-weight: bold;
        font-size: 3.4rem;
      }

      .cta-button {
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
        outline: none;
        cursor: pointer;
      }

      .cta-button:disabled {
        background-color: ${ctaButtonDisabledColor};
        cursor: not-allowed;
      }

      .paypal-upsell-slot {
        text-align: center;
      }

      .paypal-upsell-slot-blocker {
        position: absolute;
        width: 100%;
        height: 4.5rem;
        bottom: 0;
        z-index: 250;
        cursor: not-allowed;
        background-color: rgba(255, 255, 255, 0.5);
      }

      .paypal-upsell-slot-blocker.hidden {
        display: none;
      }

      #paypal-cover-button {
        position: absolute;
        width: 100%;
        bottom: 0;
      }

      .paypal-upsell-slot-container {
        position: relative;
      }

      .paypal-upsell-slot-container .paypal-cta {
        font-size: 2.4rem;
        font-weight: bold;
        margin: 0 1rem 1rem 1rem;
        text-align: center;
      }

      .error {
        font-size: 1.4rem;
        margin: 0.5rem 0;
        color: red;
      }

      .or_separator {
        position: relative;
        margin: 0 2rem;
        font-size: 2.6rem;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
      }

      .or_separator:before {
        position: absolute;
        top: calc(50% - 1px);
        right: 0;
        left: 0;
        height: 2px;
        content: '';
        background: #333;
      }

      .or_separator span {
        display: inline-block;
        position: relative;
        padding: 0 1rem;
        background: #f5f5f7;
      }
    `;
  }
}
