import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import './welcome-message';
import './subscription-summary';
import './edit-subscription';

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

@customElement('iaux-monthly-giving-circle')
export class MonthlyGivingCircle extends LitElement {
  @property({ type: String }) baseHost: string = 'archive.org';

  @property({ type: String }) giverId: string = '';

  @property({ type: Array }) activePlans: aPlan[] = [];

  @property({ type: String }) planIdToDisplay = '';

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    if (this.planIdToDisplay) {
      return html`
        <iaux-mgc-edit-subscription
          .planId=${this.planIdToDisplay}
          .plan=${this.activePlans.find(plan => plan.id === this.planIdToDisplay)}
          @closeEditSubscription=${() => {
            this.planIdToDisplay = '';
          }}
        ></iaux-mgc-edit-subscription>
      `;
    }

    if (this.giverId && this.activePlans.length) {
      return html`
        <iaux-mgc-subscription-summary
          .activePlans=${this.activePlans}
          .giverId=${this.giverId}      
          @displaySubscriptionDetails=${(e: CustomEvent) => {
            console.log('displaySubscriptionDetails', e.detail);
            this.planIdToDisplay = e.detail.id;
          }}
        >
        </iaux-mgc-subscription-summary>
      `;
    }


    return html`<iaux-mgc-welcome></iaux-mgc-welcome>`;
  }
}