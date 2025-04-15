import { LitElement, html, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type SubscriptionSummary from './models/subscription-summary';

import '@internetarchive/donation-form-section';
import { DonationPaymentInfo, DonationType } from '@internetarchive/donation-form-data-models';
export { DonationPaymentInfo } from '@internetarchive/donation-form-data-models';

@customElement('iaux-mgc-edit-plan-amount')
export class MonthlyGivingCircle extends LitElement {
  @property({ type: Object }) plan?: SubscriptionSummary;

  @property({ type: Object }) donationPaymentInfo?: DonationPaymentInfo;

  @property({ type: Boolean }) currentlyEditing: boolean = false;

  @property({ type: Boolean }) coverFees: boolean = false;

  protected createRenderRoot() {
    return this;
  }

  @query('form') form!: HTMLFormElement;

  updated(changed: PropertyValues) {
    if (changed.has('plan') && this.plan) {
      this.updatePlanInfo();
    }
    if (changed.has('coverFees')) {
      this.updatePlanInfo();
    }
    if (changed.has('currentlyEditing') && this.currentlyEditing) {
      this.form.focus();
    }

    if (changed.has('donationPaymentInfo') && !this.donationPaymentInfo) {
      this.updatePlanInfo();
    }
  }

  updatePlanInfo(newAmount?: number) {
    if (!this.donationPaymentInfo && this.plan) {
      this.donationPaymentInfo = new DonationPaymentInfo({
        donationType: DonationType.Monthly,
        amount: 0,
        coverFees: this.coverFees,
      });
      return;
    }

    let newPlan;
    if (newAmount) {
      newPlan = new DonationPaymentInfo({
        donationType: DonationType.Monthly,
        amount: newAmount,
        coverFees: this.coverFees,
      });
    } else {
      const amount = this.donationPaymentInfo ? this.donationPaymentInfo.amount : this.plan!.amount;

      console.log('AMOUNT --- ', amount);
      newPlan = new DonationPaymentInfo({
        donationType: DonationType.Monthly,
        amount,
        coverFees: this.coverFees,
      });
    }

    this.donationPaymentInfo = newPlan;
  }

  protected render() {
    console.log('plan -- ', this.plan, this.donationPaymentInfo);
    return html`
      <section>
      <donation-form-section badgemode="hidebadge" headline="Amount">
        ${!this.currentlyEditing
          ? html`<p>USD $${this.plan?.amount}</p>
        <button class="ia-button link" @click=${() => {
          this.currentlyEditing = true;
        }}>Edit...</button>`
          : nothing
        }
        ${
          this.currentlyEditing
            ? this.editAmountForm
            : nothing
        }
      </donation-form-section>

      </section>
    `;
  }

  totalAmountWithFees() {
    const amount = this.donationPaymentInfo!.amount;
    console.log('totalAmountWithFees', amount);
    return DonationPaymentInfo.calculateTotal(amount, this.coverFees);
  }

  get coveredFeesText() {
    const newAmountInput = this.querySelector('input#amount');
    const noFees = !this.donationPaymentInfo?.feeAmountCovered;
    if (!newAmountInput || noFees) {
      return `I'll generously cover fees`;
    } else {
      return `I\'ll generously add $${this.donationPaymentInfo?.feeAmountCovered} to cover fees.`;
    }
  }

  get editAmountForm() {
    console.log('plan -- ', this.plan);
    return html`
      <section>
        <form id="edit-plan-amount">
          <p>Current donation amount: $${this.plan?.amount}</p>
          <div>$ <input required type="number" min="1" max="9999" id="amount" name="amount" placeholder="Enter new amount" @input=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            const newValue = input?.value;
            const newValueNum = Number(newValue);
            console.log('new val', newValueNum);
            this.updatePlanInfo(newValueNum);
          }}> / month</div>
          <div>

          <div class="checkbox-option-container" style="display: flex;">
            <input type="checkbox" id="cover-fees" tabindex="0" @change=${
              (e: Event) => {
                console.log('checkbox', e);
                const input = e.target as HTMLInputElement;
                const coverFees = input.checked;
                this.coverFees = coverFees;
              }
            }>
            <label for="cover-fees">${this.coveredFeesText}</label>
          </div>
          <p>Total: USD $${this.totalAmountWithFees()}</p>
          <button class="ia-button secondary" @click=${(e: Event) => {
            e.preventDefault();
            const input = this.form.querySelector('input[name="amount"]') as HTMLInputElement;
            input.value = '';
            this.donationPaymentInfo = undefined;
            this.currentlyEditing = false;
            this.coverFees = false;
          }}>Cancel</button>
          <button class="ia-button primary" type="submit" @click=${(e: Event)=> {
            e.preventDefault();
            (e.target as HTMLButtonElement).disabled = true;
            const amount = this.form.querySelector('input[name="amount"]') as HTMLInputElement;
            const newValue = amount!.value;
            if (!newValue) {
              (e.target as HTMLButtonElement).disabled = false;
              return;
            }
            console.log('update amount', { newValue, oldValue: amount, display: this.donationPaymentInfo?.amount });
            this.dispatchEvent(new CustomEvent('updateAmount', {
              detail: {
                originalPlanDetails: this.plan,
                newDonationInfo: this.donationPaymentInfo,
                newAmount: Number(DonationPaymentInfo.calculateTotal(Number(this.donationPaymentInfo!.amount), this.coverFees)),
              }}))
          }}>Update</button>
          </div>
        </form>
      </section>
    `;
  }
}
