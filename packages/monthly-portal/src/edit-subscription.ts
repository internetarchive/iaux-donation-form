import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './plan-amount';
import './payment-method';
import './donation-date';
import './cancel-plan';

type aPlan = {
  id: string;
  amount: number;
  currencyType: string;
  cardInfo: {
    cardType: string;
    cardNumber: string;
  };
  nextDonation: number;
};

@customElement('iaux-mgc-edit-subscription')
export class MGCEditSubscription extends LitElement {
  @property({ type: Object }) plan?: aPlan;

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

  /*
  {
    id: 'sub-1-23-4',
    amount: '33.33',
    currencyType: 'USD',
    nextDonation: '2025-11-01T00:00:00Z',
    cardInfo: {
      cardType: 'Visa',
      cardNumber: '**** **** **** 1234',
      cardExpiration: '12/25',
    },
    cardType: 'Visa',
  }
  */

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

    return html`
      <section id="edit-subscription" planId=${this.plan?.id ?? nothing}>
        <div>
          <h2>Monthly Giving Circle</h2>
          <button>Back to account settings</button>
        </div>
        <iaux-mgc-edit-plan-amount
          .displayAmount=${this.displayAmount}
          .amount=${this.plan?.amount}
          @updateAmount=${(e: CustomEvent) => {
            console.log('updateAmount', e.detail);
            debugger;
          }}>
        </iaux-mgc-edit-plan-amount>
        <iaux-mgc-edit-plan-payment-method>
        </iaux-mgc-edit-plan-payment-method>
        <iaux-mgc-edit-donation-date>
        </iaux-mgc-edit-donation-date>
        <iaux-mgc-cancel-plan
          @cancelPlan=${(e: CustomEvent) => {
            alert('Plan cancelled');
            
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
