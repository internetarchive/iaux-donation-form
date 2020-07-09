import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
} from 'lit-element';

export enum UpsellModalCTAMode {
  YesButton = 'YesButton',
  Slot = 'Slot',
}

@customElement('upsell-modal-content')
export class UpsellModalContent extends LitElement {
  @property({ type: String }) yesButtonMode: UpsellModalCTAMode = UpsellModalCTAMode.YesButton;

  @property({ type: Number }) amount = 5;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div class="monthly-amount">
        <h1>Enter your monthly amount</h1>
        <div class="amount-input">
          <span class="dollar-symbol">$</span>
          <input type="text" value=${this.amount} @input=${this.amountChanged} />
        </div>
      </div>

      ${this.yesButton}

      <button class="no-thanks-button" @click=${this.noThanksSelected}>
        No, thanks. Maybe next year.
      </button>
    `;
  }

  private get yesButton(): TemplateResult {
    switch (this.yesButtonMode) {
      case UpsellModalCTAMode.YesButton:
        return html`
          <button class="yes-button" @click=${this.yesSelected}>
            YES, I'll become a monthly donor
          </button>
        `;
      case UpsellModalCTAMode.Slot:
        return html`
          <slot class="paypal-upsell-slot"></slot>
        `;
    }
  }

  private amountChanged(e: Event): void {
    const amount = (e.target as HTMLFormElement).value;
    console.debug('amountChanged', e, amount);
    this.amount = parseFloat(amount);
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
    return css`
      .monthly-amount {
        background-color: #fff;
        padding: 5px 0.625em;
        border-radius: 5px;
        text-align: center;
        margin-bottom: 1em;
        margin-top: 1em;
      }

      .monthly-amount h1 {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        line-height: 1.2em;
        margin: 0;
        padding: 0.5rem 0 0 0;
      }

      .amount-input .dollar-symbol {
        font-size: 18px;
        font-weight: bold;
      }

      .amount-input input {
        width: 100px;
        text-align: center;
        border: none;
        border-bottom: 1px solid gray;
        font-weight: bold;
        font-size: 34px;
      }

      .yes-button {
        font-size: 24px;
        display: block;
        width: 100%;
        padding: 0.625em;
        margin-top: 1em;
        background-color: #6d94c9;
        color: #fff;
        border-radius: 5px;
        border: 0;
        font-weight: bold;
        line-height: normal;
        margin-bottom: 0.625em;
        outline: none;
        cursor: pointer;
      }

      .no-thanks-button {
        margin-top: 1em;
        width: 100%;
        text-align: center;
        color: red;
        border: 0;
        background: none;
        cursor: pointer;
      }

      .paypal-upsell-slot {
        text-align: center;
      }
    `;
  }
}
