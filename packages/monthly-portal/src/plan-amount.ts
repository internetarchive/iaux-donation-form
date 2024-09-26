import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type SubscriptionSummary from './models/subscription-summary';

import './form-elements/contact-form/contact-form';

@customElement('iaux-mgc-edit-plan-amount')
export class MonthlyGivingCircle extends LitElement {
  @property({ type: String }) displayAmount: string = 'no amount found';

  @property({ type: String }) amount: string = '';

  @property({ type: Boolean }) currentlyEditing: boolean = false;

  protected createRenderRoot() {
    return this;
  }

  @query('form') form!: HTMLFormElement;

  updated(changed: PropertyValues) {
    if (changed.has('currentlyEditing') && this.currentlyEditing) {
      this.form.focus();
    }
  }

  protected render() {
    console.log('amount -- ', this.amount);
    return html`
      <section>
        <h3>Amount</h3>
        ${!this.currentlyEditing
          ? html`<p>${this.displayAmount}</p>
        <button class="link" @click=${() => {
          this.currentlyEditing = true;
        }}>Edit...</button>`
          : nothing
        }
        ${
          this.currentlyEditing
            ? this.editAmountForm
            : nothing
        }
      </section>
    `;
  }

  get editAmountForm() {
    console.log('amount -- ', this.amount);
    return html`
      <section>
        <form id="edit-plan-amount">
          <p>${this.displayAmount}</p>
          <div>$ <input required type="text" id="amount" name="amount" placeholder="Enter new amount" value=${this.amount}> / month</div>
          <label>
            <input type="checkbox" name="donation" value="false">
            <span>I'll generously cover the fees</span>
          </label>
          <div>
          <button class="secondary" @click=${(e: Event) => {
            e.preventDefault();
            const input = this.form.querySelector('input[name="amount"]') as HTMLInputElement;
            input.value = '';
            
            this.currentlyEditing = false;
          }}>Cancel</button>
          <button class="primary" type="submit" @click=${(e: Event)=> {
            e.preventDefault();
            (e.target as HTMLButtonElement).disabled = true;
            const amount = this.form.querySelector('input[name="amount"]') as HTMLInputElement;
            const newValue = amount!.value;
            console.log('update amount', { newValue, oldValue: this.amount, display: this.displayAmount });
          }}>Update</button>
          </div>
        </form>
      </section>
    `;
  }
}
