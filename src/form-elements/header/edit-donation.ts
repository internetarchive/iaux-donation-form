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

import currency from 'currency.js';

import '../form-section';
import { DonationType } from '../../models/donation-info/donation-type';
import { DonationPaymentInfo } from '../../models/donation-info/donation-payment-info';
import { CurrencyValidator } from './currency-validator';

enum SelectionGroup {
  DonationType = 'donationType',
  Amount = 'amount',
}

export enum DonationInfoError {
  DonationTooHigh = 'donation_too_high',
  DonationTooLow = 'donation_too_low',
}

@customElement('edit-donation')
export class EditDonation extends LitElement {
  @property({ type: Object }) donationInfo: DonationPaymentInfo = DonationPaymentInfo.default;

  @property({ type: Array }) amountOptions: number[] = [5, 10, 25, 50, 100, 500, 1000];

  @query('#custom-amount-button') customAmountButton!: HTMLInputElement;

  @query('#custom-amount-input') customAmountInput!: HTMLInputElement;

  @property({ type: Array }) private error?: TemplateResult;

  private currencyValidator: CurrencyValidator = new CurrencyValidator();

  render(): TemplateResult {
    return html`
      <form-section number="1" headline="Choose a frequency">
        <ul class="frequency-selector">
          <li>
            ${this.getRadioButton({
              group: SelectionGroup.DonationType,
              value: DonationType.OneTime,
              displayText: 'One time',
              checked: this.donationInfo.donationType === DonationType.OneTime,
            })}
          </li>

          <li>
            ${this.getRadioButton({
              group: SelectionGroup.DonationType,
              value: DonationType.Monthly,
              displayText: 'Monthly',
              checked: this.donationInfo.donationType === DonationType.Monthly,
            })}
          </li>
        </ul>
      </form-section>

      <form-section number="2" headline="Choose an amount (USD)">
        <ul class="amount-selector">
          ${this.presetAmountsTemplate}
          <li class="custom-amount">${this.customAmountTemplate}</li>
        </ul>

        <div class="errors">
          ${this.error}
        </div>

        <div class="cover-fees-container">
          <input type="checkbox" id="cover-fees" @input=${this.coverFeesChecked} />
          <label for="cover-fees">
            I'll generously add
            ${currency(this.donationInfo.fee, { formatWithSymbol: true }).format()} to cover the
            transaction fees so you can keep 100% of my donation.
          </label>
        </div>
      </form-section>
      <!-- <button @click=${this.dispatchShowSummaryClickedEvent}>Switch to Summary</button> -->
    `;
  }

  private getRadioButton(options: {
    group: SelectionGroup;
    value: string;
    displayText: string;
    checked: boolean;
  }): TemplateResult {
    const radioId = `${options.group}-${options.value}-option`;
    return html`
      <div class="selection-button">
        <input
          type="radio"
          name=${options.group}
          value=${options.value}
          id=${radioId}
          .checked=${options.checked}
          @change=${this.radioSelected}
        />
        <label for=${radioId}>${options.displayText}</label>
      </div>
    `;
  }

  private get presetAmountsTemplate(): TemplateResult {
    return html`
      ${this.amountOptions.map(
        amount => html`
          <li>
            ${this.getRadioButton({
              group: SelectionGroup.Amount,
              value: `${amount}`,
              displayText: `$${amount}`,
              checked: amount === this.donationInfo.amount,
            })}
          </li>
        `,
      )}
    `;
  }

  private get customAmountTemplate(): TemplateResult {
    const selected = !this.amountOptions.includes(this.donationInfo.amount);
    const value = selected ? this.donationInfo.amount : '';

    return html`
      <div class="selection-button">
        <input
          type="radio"
          name=${SelectionGroup.Amount}
          value="custom"
          id="custom-amount-button"
          .checked=${selected}
          @change=${this.customRadioSelected}
        />

        <label for="custom-amount-button">
          <span class="custom-amount-text">Custom: $</span
          ><input
            type="text"
            id="custom-amount-input"
            value=${value}
            @input=${this.customAmountChanged}
            @keydown=${this.currencyValidator.keydown}
            @focus=${this.customAmountFocused}
          />
        </label>
      </div>
    `;
  }

  private customRadioSelected(): void {
    this.customAmountInput.focus();
  }

  private customAmountFocused(): void {
    this.customAmountButton.checked = true;
    const parsed = parseFloat(this.customAmountInput.value);
    const amount = isNaN(parsed) ? 0 : parsed;
    this.amountChanged(amount);
  }

  private coverFeesChecked(e: Event): void {
    const target = e.target as HTMLInputElement;
    const coverFees = target.checked;
    this.donationInfo = new DonationPaymentInfo({
      amount: this.donationInfo.amount,
      donationType: this.donationInfo.donationType,
      coverFees: coverFees,
    });
    console.debug('coverFeesChecked', this.donationInfo);
    this.dispatchDonationInfoChangedEvent();
  }

  private customAmountChanged(e: Event): void {
    const target = e.target as HTMLInputElement;
    const amount = target.value;
    const parsed = parseFloat(amount);
    this.amountChanged(parsed);
  }

  private amountChanged(amount: number): void {
    console.debug('amountChanged', amount);

    if (amount > 10000) {
      this.error = html`
        To make a donation of $10,000 or more, please contact our philanthropy department at
        <a href="mailto:donations@archive.org">donations@archive.org</a>
      `;
      this.dispatchEditDonationError(DonationInfoError.DonationTooHigh);
      return;
    }

    if (amount < 1) {
      if (this.customAmountInput.value.length > 0) {
        this.error = html`
          Please select an amount (minimum $1)
        `;
      }
      this.dispatchEditDonationError(DonationInfoError.DonationTooLow);
      return;
    }

    this.error = undefined;
    this.donationInfo.amount = amount;
    this.dispatchDonationInfoChangedEvent();
  }

  private radioSelected(e: Event): void {
    const radioButton = e.target as HTMLInputElement;
    const group = radioButton.name as SelectionGroup;
    const { value } = radioButton;

    switch (group) {
      case SelectionGroup.Amount:
        this.presetAmountChanged(parseFloat(value));
        break;
      case SelectionGroup.DonationType:
        this.donationTypeChanged(value as DonationType);
        break;
      default:
        break;
    }
  }

  private dispatchEditDonationError(error: DonationInfoError): void {
    const event = new CustomEvent('editDonationError', { detail: { error: error } });
    this.dispatchEvent(event);
  }

  private dispatchShowSummaryClickedEvent(): void {
    this.dispatchEvent(new Event('showSummaryClicked'));
  }

  private donationTypeChanged(donationType: DonationType): void {
    this.donationInfo.donationType = donationType;
    console.debug('EditDonation donationTypeChanged', donationType);
    this.dispatchDonationInfoChangedEvent();
  }

  private presetAmountChanged(amount: number): void {
    this.error = undefined;
    this.donationInfo.amount = amount;
    console.debug('EditDonation amountChanged', amount);
    this.dispatchDonationInfoChangedEvent();
  }

  private dispatchDonationInfoChangedEvent(): void {
    console.debug('dispatchDonationInfoChangedEvent', this.donationInfo);

    const newDonationInfo = new DonationPaymentInfo({
      donationType: this.donationInfo.donationType,
      amount: this.donationInfo.amount,
      coverFees: this.donationInfo.coverFees,
    });

    const event = new CustomEvent('donationInfoChanged', {
      detail: { donationInfo: newDonationInfo },
    });
    this.dispatchEvent(event);
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const buttonGridGapCss = css`var(--paymentButtonGridGap, 10px)`;
    const buttonFontSizeCss = css`var(--paymentButtonFontSize, 16px)`;
    const buttonSelectedColorCss = css`var(--paymentButtonSelectedColor, #f9bf3b)`;
    const buttonColorCss = css`var(--paymentButtonColor, #fff)`;
    const coverFeesFontSizeCss = css`var(--coverFeesFontSize, 12px)`;
    const coverFeesFontWeightCss = css`var(--coverFeesFontWeight, bold)`;

    return css`
      .errors {
        color: red;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-gap: ${buttonGridGapCss};
      }

      li {
        margin: 0;
        padding: 0;
        display: inline-block;
      }

      .selection-button {
        height: 30px;
      }

      .selection-button label {
        padding: 0 5px;
        display: flex;
        color: #202020;
        cursor: pointer;
        text-align: center;
        font-size: ${buttonFontSizeCss};
        font-weight: bold;
        border: 1px solid black;
        border-radius: 5px;
        background-color: #ccc;
        height: 100%;
        justify-content: center;
        align-items: center;
      }

      label[for='custom-amount-button'] {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .custom-amount-text {
        white-space: nowrap;
      }

      input[type='radio'] {
        display: none;
      }

      input[type='radio'] + label {
        background-color: ${buttonColorCss};
      }

      input[type='radio']:checked + label {
        background-color: ${buttonSelectedColorCss};
      }

      .cover-fees-container {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cover-fees-container input {
        width: 20px;
      }

      .cover-fees-container label {
        font-size: ${coverFeesFontSizeCss};
        font-weight: ${coverFeesFontWeightCss};
        flex: 1;
      }

      .amount-selector {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      }

      .frequency-selector {
        grid-template-columns: 1fr 1fr;
      }

      .custom-amount {
        grid-column-start: 3;
        grid-column-end: 6;
      }

      #custom-amount-input {
        width: 4em;
        font-size: 16px;
      }
    `;
  }
}
