import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
  query,
} from 'lit-element';
import { CurrencyValidator } from '../form-elements/header/currency-validator';

export enum UpsellModalCTAMode {
  YesButton = 'YesButton',
  PayPalUpsellSlot = 'PayPalUpsellSlot',
}

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
      <div class="monthly-amount">
        <h1>Enter your monthly amount</h1>
        <div class="amount-input">
          <span class="dollar-symbol">$</span>
          <input
            id="amount-input"
            type="text"
            value=${this.amount}
            @input=${this.amountChanged}
            @keydown=${this.currencyValidator.keydown}
          />
        </div>
        <div class="error">${this.error}</div>
      </div>

      ${this.yesButton}

      <button class="no-thanks-button" @click=${this.noThanksSelected}>
        No, thanks. Maybe next time.
      </button>
    `;
  }

  private get yesButton(): TemplateResult {
    switch (this.yesButtonMode) {
      case UpsellModalCTAMode.YesButton:
        return html`
          <button
            class="yes-button"
            @click=${this.yesSelected}
            .disabled=${this.error !== undefined}
          >
            YES, I'll become a monthly donor
          </button>
        `;
      case UpsellModalCTAMode.PayPalUpsellSlot:
        return html`
          <div class="paypal-upsell-slot-container">
            <div class="paypal-upsell-slot-blocker ${this.error ? '' : 'hidden'}"></div>
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
    console.debug('parsed', value, amount);
    if (isNaN(amount)) {
      this.error = html`
        Please enter a valid amount.
      `;
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
        this.error = html`
          The minimum donation amount is $1.
        `;
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
    const yesButtonColor = css`var(--upsellYesButtonColor, rgb(109,148,201))`;
    const yesButtonDisabledColor = css`var(--upsellYesButtonDisabledColor, rgba(109,148,201,0.5))`;
    const noThanksFontSize = css`var(--upsellNoThanksFontSize, 1.4rem)`;
    const amountInputOffset = css`var(--upsellAmountInputOffset, -1rem)`;

    return css`
      .monthly-amount {
        background-color: #fff;
        padding: 0.5rem 0.625rem;
        border-radius: 5px;
        text-align: center;
        margin-bottom: 1em;
        margin-top: 1em;
      }

      .monthly-amount h1 {
        font-size: 1.8rem;
        font-weight: bold;
        text-align: center;
        line-height: 1.2em;
        margin: 0;
        padding: 0.5rem 0 0 0;
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

      .yes-button {
        font-size: 2.4rem;
        display: block;
        width: 100%;
        padding: 0.625rem;
        margin-top: 1rem;
        background-color: ${yesButtonColor};
        color: #fff;
        border-radius: 5px;
        border: 0;
        font-weight: bold;
        line-height: normal;
        outline: none;
        cursor: pointer;
      }

      .yes-button:disabled {
        background-color: ${yesButtonDisabledColor};
        cursor: not-allowed;
      }

      .no-thanks-button {
        margin-top: 1rem;
        width: 100%;
        text-align: center;
        color: red;
        border: 0;
        background: none;
        font-size: ${noThanksFontSize};
        cursor: pointer;
      }

      .paypal-upsell-slot {
        text-align: center;
      }

      .paypal-upsell-slot-blocker {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 250;
        cursor: not-allowed;
        background-color: rgba(255, 255, 255, 0.5);
      }

      .paypal-upsell-slot-blocker.hidden {
        display: none;
      }

      .paypal-upsell-slot-container {
        position: relative;
      }

      .error {
        font-size: 1.4rem;
        margin: 0.5rem 0;
        color: red;
      }
    `;
  }
}
