import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
  query,
  PropertyValues,
} from 'lit-element';

import currency from 'currency.js';

import {
  DonationType,
  DonationPaymentInfo,
  defaultDonationAmounts,
} from '@internetarchive/donation-form-data-models';

import { CurrencyValidator } from '@internetarchive/donation-form-currency-validator';

import { DonationFormSectionBadgeMode } from '@internetarchive/donation-form-section';

export enum DonationFormEditDonationStepNumberMode {
  HideNumbers = 'hidenumbers',
  ShowNumbers = 'shownumbers',
}

export enum EditDonationSelectionGroup {
  DonationType = 'donationType',
  Amount = 'amount',
}

export enum EditDonationInfoStatus {
  ValidDonationAmount = 'valid_donation_amount',
  InvalidDonationAmount = 'invalid_donation_amount',
  DonationTooHigh = 'donation_too_high',
  DonationTooLow = 'donation_too_low',
}

@customElement('donation-form-edit-donation')
export class DonationFormEditDonation extends LitElement {
  @property({ type: Object })
  donationInfo: DonationPaymentInfo = new DonationPaymentInfo({
    donationType: DonationType.OneTime,
    amount: 5,
    coverFees: false,
  });

  @property({ type: String })
  stepNumberMode: DonationFormEditDonationStepNumberMode =
    DonationFormEditDonationStepNumberMode.ShowNumbers;

  @property({ type: Array }) amountOptions: number[] = defaultDonationAmounts;

  @property({ type: Object }) private error?: TemplateResult;

  @query('#custom-amount-button') private customAmountButton?: HTMLInputElement;

  @query('#custom-amount-input') private customAmountInput?: HTMLInputElement;

  private currencyValidator: CurrencyValidator = new CurrencyValidator();

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <donation-form-section
        sectionBadge="1"
        headline="Choose a frequency"
        badgeMode=${this.formSectionNumberMode}
      >
        <ul class="frequency-selector">
          ${this.frequencyTemplate}
        </ul>
      </donation-form-section>

      <donation-form-section
        sectionBadge="2"
        headline="Choose an amount (USD)"
        badgeMode=${this.formSectionNumberMode}
      >
        <ul class="amount-selector">
          ${this.presetAmountsTemplate}
          <li class="custom-amount">${this.customAmountTemplate}</li>
        </ul>

        <div class="errors">${this.error}</div>

        <div class="cover-fees-container">
          <input
            type="checkbox"
            id="cover-fees"
            @input=${this.coverFeesChecked}
            .checked=${this.donationInfo.coverFees}
            tabindex="0"
          />
          <label for="cover-fees"> ${this.coverFeesTextTemplate} </label>
        </div>
      </donation-form-section>
    `;
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('donationInfo')) {
      this.updateSelectedDonationInfo();
    }
  }

  private get formSectionNumberMode(): DonationFormSectionBadgeMode {
    switch (this.stepNumberMode) {
      case DonationFormEditDonationStepNumberMode.ShowNumbers:
        return DonationFormSectionBadgeMode.ShowBadge;
      case DonationFormEditDonationStepNumberMode.HideNumbers:
        return DonationFormSectionBadgeMode.HideBadge;
    }
  }

  private updateSelectedDonationInfo(): void {
    if (!this.customAmountButton || !this.customAmountInput) {
      return;
    }
    if (
      !this.customAmountButton.checked &&
      this.amountOptions.includes(this.donationInfo.amount)
    ) {
      const radioButton = this.shadowRoot?.querySelector(
        `input[type="radio"][name="${EditDonationSelectionGroup.Amount}"][value="${this.donationInfo.amount}"]`
      ) as HTMLInputElement;
      radioButton.checked = true;
      this.customAmountButton.checked = false;
      this.customAmountInput.value = '';
    } else {
      this.customAmountButton.checked = true;
      // don't update the value if it currently has focus
      // since the user may be typing in it at the time
      if (this.shadowRoot?.activeElement !== this.customAmountInput) {
        this.customAmountInput.value = `${this.donationInfo.amount}`;
        const donationInfoStatus = this.getDonationInfoStatus(
          this.donationInfo.amount
        );
        this.handleDonationInfoStatus(donationInfoStatus);
      }
    }
  }

  private get coverFeesTextTemplate(): TemplateResult {
    return html`
      I'll generously add ${this.feeAmountString} to cover the transaction fees
      for my ${this.shortenedContributionAmount} contribution so you can keep
      100% of my donation.
    `;
  }

  private get feeAmountString(): string {
    return currency(this.donationInfo.fee, { symbol: '$' }).format();
  }

  private get shortenedContributionAmount(): string {
    // if the amount is a whole number, show it without the decimals
    const precision = this.donationInfo.amount % 1 === 0 ? 0 : 2;
    return currency(this.donationInfo.amount, {
      symbol: '$',
      precision: precision,
    }).format();
  }

  private get frequencyTemplate(): TemplateResult {
    return html`
      <li>
        ${this.getRadioButton({
          group: EditDonationSelectionGroup.DonationType,
          value: DonationType.OneTime,
          displayText: 'One time',
          checked: this.donationInfo.donationType === DonationType.OneTime,
        })}
      </li>

      <li>
        ${this.getRadioButton({
          group: EditDonationSelectionGroup.DonationType,
          value: DonationType.Monthly,
          displayText: 'Monthly',
          checked: this.donationInfo.donationType === DonationType.Monthly,
        })}
      </li>
    `;
  }

  private get presetAmountsTemplate(): TemplateResult {
    return html`
      ${this.amountOptions.map(amount => {
        const checked =
          !this.customAmountButton?.checked &&
          amount === this.donationInfo.amount;
        return html`
          <li>
            ${this.getRadioButton({
              group: EditDonationSelectionGroup.Amount,
              value: `${amount}`,
              displayText: `$${amount}`,
              checked: checked,
            })}
          </li>
        `;
      })}
    `;
  }

  private getRadioButton(options: {
    group: EditDonationSelectionGroup;
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
          tabindex="0"
          .checked=${options.checked}
          @change=${this.radioSelected}
        />
        <label for=${radioId}> ${options.displayText} </label>
      </div>
    `;
  }

  private get customAmountTemplate(): TemplateResult {
    const isCustomAmount = !this.amountOptions.includes(
      this.donationInfo.amount
    );
    const value = isCustomAmount ? this.donationInfo.amount : '';

    return html`
      <div class="selection-button">
        <input
          type="radio"
          name=${EditDonationSelectionGroup.Amount}
          value="custom"
          id="custom-amount-button"
          tabindex="0"
          @change=${this.customRadioSelected}
        />

        <label for="custom-amount-button">
          <span class="custom-amount-text">Custom: $</span
          ><input
            type="text"
            id="custom-amount-input"
            tabindex="-1"
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
    this.customAmountInput?.focus();
  }

  private customAmountFocused(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (this.customAmountButton) {
      this.customAmountButton.checked = true;
    }
    this.handleCustomAmountInput(target.value);
  }

  private coverFeesChecked(e: Event): void {
    const target = e.target as HTMLInputElement;
    const coverFees = target.checked;
    this.updateDonationInfo({ coverFees: coverFees });
  }

  private customAmountChanged(e: Event): void {
    const target = e.target as HTMLInputElement;
    const amount = target.value;
    if (this.customAmountButton) {
      this.customAmountButton.checked = true;
    }
    this.handleCustomAmountInput(amount);
  }

  private handleCustomAmountInput(value: string): void {
    const amount = parseFloat(value);
    if (isNaN(amount)) {
      this.dispatchEditDonationError(
        EditDonationInfoStatus.InvalidDonationAmount
      );
    } else {
      this.amountChanged(amount);
    }
  }

  private handleDonationInfoStatus(status: EditDonationInfoStatus): void {
    switch (status) {
      case EditDonationInfoStatus.ValidDonationAmount:
        this.error = undefined;
        break;
      case EditDonationInfoStatus.DonationTooHigh:
        this.error = html`
          To make a donation of $10,000 or more, please contact our philanthropy
          department at
          <a href="mailto:donations@archive.org">donations@archive.org</a>
        `;
        this.dispatchEditDonationError(status);
        break;
      case EditDonationInfoStatus.DonationTooLow:
        if (this.customAmountInput && this.customAmountInput.value.length > 0) {
          this.error = html` Please select an amount (minimum $1) `;
        }
        this.dispatchEditDonationError(status);
        break;
      case EditDonationInfoStatus.InvalidDonationAmount:
        this.error = html` Please enter a valid donation amount `;
        this.dispatchEditDonationError(status);
        break;
    }
  }

  private amountChanged(amount: number): void {
    const donationInfoStatus = this.getDonationInfoStatus(amount);
    this.handleDonationInfoStatus(donationInfoStatus);

    // only update the donation info if it's a valid amount
    if (donationInfoStatus === EditDonationInfoStatus.ValidDonationAmount) {
      this.updateDonationInfo({ amount: amount });
    }
  }

  private getDonationInfoStatus(amount: number): EditDonationInfoStatus {
    if (isNaN(amount)) {
      return EditDonationInfoStatus.InvalidDonationAmount;
    }

    if (amount >= 10000) {
      return EditDonationInfoStatus.DonationTooHigh;
    }

    if (amount < 1) {
      return EditDonationInfoStatus.DonationTooLow;
    }

    return EditDonationInfoStatus.ValidDonationAmount;
  }

  private radioSelected(e: Event): void {
    const radioButton = e.target as HTMLInputElement;
    const group = radioButton.name as EditDonationSelectionGroup;
    const { value } = radioButton;

    switch (group) {
      case EditDonationSelectionGroup.Amount:
        this.presetAmountChanged(parseFloat(value));
        break;
      case EditDonationSelectionGroup.DonationType:
        this.updateDonationInfo({ donationType: value as DonationType });
        break;
      default:
        break;
    }
  }

  private dispatchEditDonationError(error: EditDonationInfoStatus): void {
    const event = new CustomEvent('editDonationError', {
      detail: { error: error },
    });
    this.dispatchEvent(event);
  }

  private presetAmountChanged(amount: number): void {
    this.error = undefined;
    if (this.customAmountInput) this.customAmountInput.value = '';
    this.updateDonationInfo({ amount: amount });
  }

  private updateDonationInfo(options: {
    donationType?: DonationType;
    amount?: number;
    coverFees?: boolean;
  }): void {
    const newDonationInfo = new DonationPaymentInfo({
      donationType: options.donationType ?? this.donationInfo.donationType,
      amount: options.amount ?? this.donationInfo.amount,
      coverFees: options.coverFees ?? this.donationInfo.coverFees,
    });

    this.donationInfo = newDonationInfo;

    const event = new CustomEvent('donationInfoChanged', {
      detail: { donationInfo: newDonationInfo },
    });
    this.dispatchEvent(event);
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const buttonBorderColorCss = css`var(--paymentButtonBorderColor, #333)`;
    const buttonGridGapCss = css`var(--paymentButtonGridGap, 1rem)`;
    const buttonFontSizeCss = css`var(--paymentButtonFontSize, 1.6rem)`;
    const buttonSelectedColorCss = css`var(--paymentButtonSelectedColor, #f9bf3b)`;
    const buttonFocusedOutlineColorCss = css`var(--paymentButtonFocusedOutlineColor, #7fb3f9)`;
    const buttonColorCss = css`var(--paymentButtonColor, #fff)`;
    const coverFeesFontSizeCss = css`var(--coverFeesFontSize, 1.2rem)`;
    const coverFeesFontWeightCss = css`var(--coverFeesFontWeight, bold)`;
    const customAmountWidth = css`var(--customAmountWidth, 4rem)`;
    const fieldFontColor = css`var(--inputFieldFontColor, #333)`;
    const customAmountBorderCss = css`var(--inputBorder, 1px solid #d9d9d9)`;

    return css`
      .errors {
        color: red;
        font-size: 1.4rem;
        margin-top: 0.5rem;
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
        height: 3rem;
      }

      .selection-button label {
        padding: 0 0.3rem;
        display: flex;
        cursor: pointer;
        text-align: center;
        font-size: ${buttonFontSizeCss};
        font-weight: bold;
        border: 1px solid ${buttonBorderColorCss};
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
        margin-right: 0.5rem;
      }

      input[type='radio'] {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }

      input[type='radio'] + label {
        background-color: ${buttonColorCss};
      }

      input[type='radio']:checked + label {
        background-color: ${buttonSelectedColorCss};
      }

      input[type='radio']:focus + label {
        outline: 2px solid ${buttonFocusedOutlineColorCss};
      }

      .cover-fees-container {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cover-fees-container input {
        width: 2rem;
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
        width: ${customAmountWidth};
        font-size: 1.6rem;
        font-weight: bold;
        color: ${fieldFontColor};
        padding: 0.1rem;
        border: ${customAmountBorderCss};
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
      }
    `;
  }
}
