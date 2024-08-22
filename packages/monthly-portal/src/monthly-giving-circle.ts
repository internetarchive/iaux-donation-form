import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import '@internetarchive/icon-donate';
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
  @property({
    type: Boolean,
    reflect: true,
  }) seeRecentDonations: boolean = false;

  @property({ type: String }) giverId: string = '';

  @property({ type: Array }) activePlans: aPlan[] = [];

  @property({ type: String }) planIdToDisplay = '';

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    const withPlansClass = this.activePlans.length ? 'with-plans' : 'without-plans';
    return html`
      <section class=${withPlansClass}>
        <h2 class="mgc-title">
          <span class="heart-label">
            <span class="heart-icon">
              <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-labelledby="donateTitleID donateDescID">
                <title id="donateTitleID">Donate</title>
                <path class="fill-color" d="m30.0120362 11.0857287c-1.2990268-1.12627221-2.8599641-1.65258786-4.682812-1.57894699-.8253588.02475323-1.7674318.3849128-2.8262192 1.08047869-1.0587873.6955659-1.89622 1.5724492-2.512298 2.63065-.591311-1.0588196-1.4194561-1.9357029-2.4844351-2.63065-1.0649791-.69494706-2.0039563-1.05510663-2.8169316-1.08047869-1.2067699-.04950647-2.318187.17203498-3.3342513.66462439-1.0160643.4925893-1.82594378 1.2002224-2.42963831 2.1228992-.60369453.9226769-.91173353 1.9629315-.92411701 3.1207641-.03715043 1.9202322.70183359 3.7665141 2.21695202 5.5388457 1.2067699 1.4035084 2.912594 3.1606786 5.1174721 5.2715107 2.2048782 2.1108321 3.7565279 3.5356901 4.6549492 4.2745742.8253588-.6646243 2.355647-2.0647292 4.5908647-4.2003145s3.9747867-3.9171994 5.218707-5.3448422c1.502735-1.7723316 2.2355273-3.6186135 2.1983769-5.5388457-.0256957-1.7608832-.6875926-3.2039968-1.9866194-4.3302689z"></path>
              </svg>
            </span>
            <span>Monthly Giving Circle</span>
          </span>
          <button id="click-to-join" @click=${() => {
              this.seeRecentDonations = true;
              this.dispatchEvent(new Event('mgc-recent-donations-request'));
              console.log('View recent donation history');
          }}>View recent donation history</button>
        </h2>
        ${this.renderBody()}
      </section>
    `;
  }

  protected renderBody() {
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