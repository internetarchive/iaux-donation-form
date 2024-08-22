import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type SubscriptionSummary from './models/subscription-summary';

import './form-elements/contact-form/contact-form';

@customElement('iaux-mgc-cancel-plan')
export class IauxMgcCancelPlan extends LitElement {
  @property({ type: Object }) plan?: SubscriptionSummary;

  protected createRenderRoot() {
    return this;
  }

  async cancelSubscription(e: Event) {
    e.preventDefault();
    console.log('canceling subscription', { plan: this.plan });
    this.dispatchEvent(new CustomEvent('cancelSubscription', {
      detail: { plan: this.plan },
    }));
  }

  protected render() {
    return html`
    <section class="cancel-donation">
      <h3>Cancel recurring donation</h3>

      <p>Canceling ends your monthly recurring donation to the Internet Archive, effective immediately. You will not be charged moving forward.</p>
      <p>Canceling does not affect your account or access to the Internet Archive, although you will no longer have access to any of the Monthly Giving Circle perks.</p>
      <p>If you have any questions regarding donations, contact us at donations@archive.org</p>

      <form @submit=${(e: Event) => this.cancelSubscription(e)}>
        <button type="submit">I'm sure I want to cancel my recurring donation.</button>
      </form>
    </section>
    `;
  }
}
