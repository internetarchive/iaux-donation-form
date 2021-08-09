import { defaultSelectedDonationInfo, DonationPaymentInfo, DonationType } from "@internetarchive/donation-form-data-models";
import { css, CSSResult, customElement, html, LitElement, query, TemplateResult } from "lit-element";
import { DonationFormEditDonation, DonationFormEditDonationStepNumberMode } from "../src/donation-form-edit-donation";

@customElement('app-root')
export class AppRoot extends LitElement {
  @query('donation-form-edit-donation') private editDonation!: DonationFormEditDonation;

  @query('#total') private totalDiv!: HTMLSpanElement;

  @query('#error') private errorDiv!: HTMLDivElement;

  @query('#coverfees-checkbox') private coverFeesCheckbox!: HTMLInputElement;

  @query('input[name=donationType][value=one-time]') private oneTimeRadio!: HTMLInputElement;

  @query('input[name=donationType][value=monthly]') private monthlyRadio!: HTMLInputElement;

  @query('input[name=donationType]:checked') private selectedDonationType!: HTMLInputElement;

  @query('#amount-input') private amountInput!: HTMLInputElement;

  @query('#dollar-amounts') private dollarAmounts!: HTMLInputElement;

  render(): TemplateResult {
    return html`
      <donation-form-edit-donation
        .donationInfo=${defaultSelectedDonationInfo}
        @donationInfoChanged=${this.donationInfoChanged}
        @editDonationError=${this.editDonationError}
        stepNumberMode="shownumbers"
      >
      </donation-form-edit-donation>

      <hr>

      ${this.devToolsTemplate}
    `;
  }

  private get devToolsTemplate(): TemplateResult {
    return html`
      <div id="dev-tools">
        <h2>Dev Tools:</h2>

        <button @click=${this.toggleNumbers}>Toggle Number Visibility</button>

        <div class="amount">
          Total: <div id="total">$5.00</div>
        </div>
        <fieldset>
          <legend>Donation Info</legend>
          <ul>
            <li>
              <input type="radio" name="donationType" value="one-time" checked /> One Time
              <input type="radio" name="donationType" value="monthly" /> Monthly
            </li>
            <li>
              $ <input type="text" id="amount-input" value="5.00" />
            </li>
            <li>
              <input type="checkbox" id="coverfees-checkbox" /> Cover fees
            </li>
            <li>
              <button @click=${this.updateForm}>Update</button>
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Dollar Amounts</legend>
          <ul>
            <li>
              Amounts: <input type="text" id="dollar-amounts" value="5, 10, 25, 50, 100, 500, 1000" />
            </li>
            <li>
              <button @click=${this.updateAmounts}>Update</button>
            </li>
          </ul>
        </fieldset>

        <div id="error">
        </div>
      </div>
    `;
  }

  private donationInfoChanged(e: CustomEvent): void {
    const donationInfo: DonationPaymentInfo = e.detail.donationInfo;
    this.totalDiv.innerText = `$${donationInfo.total}`;
    this.errorDiv.innerText = '';
    this.amountInput.value = `${donationInfo.amount}`;
    this.coverFeesCheckbox.checked = donationInfo.coverFees;
    if (donationInfo.donationType === DonationType.OneTime) {
      this.oneTimeRadio.checked = true;
    } else {
      this.monthlyRadio.checked = true;
    }
  }

  private toggleNumbers(): void {
    this.editDonation.stepNumberMode =
      this.editDonation.stepNumberMode === 'shownumbers'
        ? DonationFormEditDonationStepNumberMode.HideNumbers
        : DonationFormEditDonationStepNumberMode.ShowNumbers;
  }

  private editDonationError(e: CustomEvent): void {
    this.errorDiv.innerText = e.detail.error;
    this.totalDiv.innerText = 'Invalid'
  }

  private updateForm(): void {
    const donationInfo = new DonationPaymentInfo({
      amount: parseFloat(this.amountInput.value),
      donationType: this.selectedDonationType.value as DonationType,
      coverFees: this.coverFeesCheckbox.checked,
    });
    this.editDonation.donationInfo = donationInfo;
  }

  private updateAmounts(): void {
    const values = this.dollarAmounts.value;
    const splitValues = values.split(',');
    const numberArray = splitValues.map(value => parseFloat(value));
    this.editDonation.amountOptions = numberArray;
  }

  static get styles(): CSSResult {
    return css`
      donation-form-edit-donation {
        width: 32rem;
        display: block;
      }

      #dev-tools {
        font-size: 1.6rem;
      }
    `;
  }
}
