import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type SubscriptionSummary from './models/subscription-summary';

import './form-elements/contact-form/contact-form';

@customElement('iaux-mgc-edit-plan-amount')
export class MonthlyGivingCircle extends LitElement {
  @property({ type: String }) displayAmount: string = 'no amount found';

  @property({ type: String }) amount: string = '';

  protected createRenderRoot() {
    return this;
  }

  @query('form') form!: HTMLFormElement;

  protected render() {
    return html`
      <section>
        <h3>Plan Amount</h3>
        <form id="edit-plan-amount">
          <p>${this.displayAmount}</p>
          <input type="text" id="amount" name="amount" placeholder="Enter new amount" value=${this.amount}>
          <label>
            <span>I'll generously cover the fees</span>
            <input type="checkbox" name="donation" value="false">
          </label>
          <button class="ia-button" type="submit" @click=${(e: Event)=> {
            e.preventDefault();
            const amount = this.form.querySelector('input[name="amount"]') as HTMLInputElement;
            const newValue = amount!.value;
            console.log('update amount', { newValue, oldValue: this.amount, display: this.displayAmount });
          }}>Update</button>
          <button type="button" @click=${(e: Event) => {
            e.preventDefault();
            console.log('cancel amount', { oldValue: this.amount, display: this.displayAmount });
          }}>Cancel</button>
        </form>
      </section>
      
    `;
  }
}
