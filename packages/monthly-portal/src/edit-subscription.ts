import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './plan-amount';
import './payment-method';
import './donation-date';
import './cancel-plan';
import SubscriptionSummary from './models/subscription-summary';

@customElement('iaux-mgc-edit-subscription')
export class MGCEditSubscription extends LitElement {
  @property({ type: Object }) plan?: SubscriptionSummary;

  @property({ type: String }) planId: string = '';

  @property({ type: String }) baseHost: string = 'archive.org';

  @property({ type: String }) amount: string = '';

  @property({ type: String }) paymentMethod: string = '';

  @property({ type: String }) planDate: string = ''; 

  @property({ type: String }) newAmount: string = '';

  @property({ type: String }) newPaymentMethod: string = '';

  @property({ type: String }) newPlanDate: string = '';

  @property({ type: Boolean }) waitingForNetworkRequest: boolean = false;

  protected createRenderRoot() {
    return this;
  }

  updated(changed: PropertyValues) {
    if (changed.has('plan')) {
      console.log('plan updated', this.plan);
    }
  }

  get currencySymbol() {
    if (this.plan?.currencyType === 'USD') {
      return '$';
    }
  }

  get displayAmount() {
    return `${this.plan?.currencyType}${this.currencySymbol}${this.plan?.amount}`;
  }

  protected render() {
    console.log('this.plan', this.plan);

    /*



    */
    return html`
      <section id="edit-subscription" planId=${this.plan?.id ?? nothing}>
        <iaux-mgc-edit-plan-amount
          .displayAmount=${this.displayAmount}
          .plan=${this.plan}
          @updateAmount=${(e: CustomEvent) => {
            console.log('updateAmount', e.detail);
            const newAmount = e.detail.newAmount;
            const plan = e.detail.plan;
            this.dispatchEvent(new CustomEvent('editAmount', { detail: { newAmount, plan } }));
            debugger;
          }}>
        </iaux-mgc-edit-plan-amount>
        <hr>
        <iaux-mgc-edit-plan-payment-method
          .plan=${this.plan}
          @editPaymentMethod=${(e: CustomEvent) => {
            alert('Payment method edited');
            this.waitingForNetworkRequest = true;
            const newPaymentMethod = e.detail.newPaymentMethod;
            const plan = e.detail.plan;
            this.dispatchEvent(new CustomEvent('editPaymentMethod', { detail: { newPaymentMethod, plan } }));
          }}
        ></iaux-mgc-edit-plan-payment-method>
        <hr>
        <iaux-mgc-edit-donation-date
          .plan=${this.plan}
          @editDate=${(e: CustomEvent) => {
            alert('Date edited');
            this.waitingForNetworkRequest = true;
            const newDate = e.detail.newDate;
            const plan = e.detail.plan;
            this.dispatchEvent(new CustomEvent('editDate', { detail: { newDate, plan } }));
          }}
        >
        </iaux-mgc-edit-donation-date>
        <hr>
        <iaux-mgc-cancel-plan
          .plan=${this.plan}
          @cancelPlan=${(e: CustomEvent) => {
            alert('Plan cancelled');
            this.waitingForNetworkRequest = true;
            const plan = e.detail.plan;
            this.dispatchEvent(new CustomEvent('cancelPlan', { detail: { plan } }));
          }}
        ></iaux-mgc-cancel-plan>
      </section>
    `;
  }

  static styles: CSSResult = css`
    section {
      margin: 1rem;
    }

    ul {
      list-style-type: disc;
      padding-left: 1rem;
    }`;
}
