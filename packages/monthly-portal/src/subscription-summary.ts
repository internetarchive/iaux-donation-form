import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type SubscriptionSummary from './models/subscription-summary';


@customElement('iaux-mgc-subscription-summary')
export class MonthlyGivingCircle extends LitElement {
  @property({ type: String }) baseHost: string = 'archive.org';

  @property({ type: String }) giverId: string = '';

  @property({ type: Array }) activePlans: SubscriptionSummary[] = [];

  @property({ type: String }) planIdToDisplay = '';

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    if (!this.activePlans.length) {
      return html`<p>No active plans found</p>`;
    }

    if (this.activePlans.find(plan => plan.id === this.planIdToDisplay)) {
      return html`
        <iaux-mgc-edit-subscription
          .planId=${this.planIdToDisplay}
          @closeEditSubscription=${() => {
            this.planIdToDisplay = '';
          }}
        ></iaux-mgc-edit-subscription>
      `;

    }

    return html`
      <section class="monthly-giving-circle">
        <ul>
          ${this.activePlans.map((plan: SubscriptionSummary) => {
          const methodType = plan.payment.paymentMethodType ?? 'Method not found';
          const cardType = plan.payment.cardType ?? 'Card type not found';
          const last4 = plan.payment.last4 ? `...${plan.payment.last4}` : 'CC number not found';
          const nextBillingDate = plan.payment.nextBillingDate ?? '';
          console.log(' ******** ');
          console.log('plan: ', plan);
          return html`
            <li>
              <div class="info">
                <div>
                  <h3>Amount</h3>
                  <p>${plan.currencyType} ${plan.amount}/month</p>
                </div>
                <div>
                  <h3>Method</h3>
                  <p>${methodType}</p>
                  ${ plan.payment.cardType === 'creditCard'
                  ? html`<p>${cardType}</p><p>${last4}</p>`
                  : nothing
                  }
                  
                  ${ plan.payment.paymentMethodType === 'Paypal'
                  ? html`<p>Paypal email: <a href=${`mailto:${plan.payment.paypalEmail}`}>${plan.payment.paypalEmail}</a></p>`
                  : nothing
                  }

                  ${ plan.payment.paymentMethodType === 'Venmo'
                  ? html`<p>Venmo username: <a href=${`mailto:${plan.payment.venmoUsername}`}>${plan.payment.paypalEmail}</a></p>`
                  : nothing
                  }
                  <p>Expires: ${plan.payment.expirationMonth ?? 'month not found'}/${plan.payment.expirationYear ?? 'year not found'}</p>
                </div>
                <div>
                  <h3>Next Donation</h3>
                  <p>${nextBillingDate ? this.formatTime(nextBillingDate) : 'not found'}</p>
                </div>
              </div>
              <button @click=${() => this.manageDonation(plan)}>Manage this monthly donation</button>
            </li>
          `
          })}
        </ul>
      </section>
    `;
  }

  formatTime(nextBillingDateInfo: SubscriptionSummary['payment']['nextBillingDate']): string {
    if (!nextBillingDateInfo) {
      return '';
    }
    const time = new Date(nextBillingDateInfo.date);
    const timeToDisplay = time.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    // if (nextBillingDateInfo.timezone_type && nextBillingDateInfo.timezone) {
    //   timeToDisplay = time.toLocaleString(nextBillingDate.timezone, { timeZone: nextBillingDateInfo.timezone });
    // }
    return timeToDisplay;
  }

  manageDonation(plan: SubscriptionSummary) {
    this.dispatchEvent(new CustomEvent('displaySubscriptionDetails', {
      detail: { plan },
      bubbles: true,
      composed: true
    }));
    console.log('Manage donation: ', plan);
  };
}
