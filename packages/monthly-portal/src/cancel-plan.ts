import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type SubscriptionSummary from './models/subscription-summary';

import './form-elements/contact-form/contact-form';

@customElement('iaux-mgc-cancel-plan')
export class IauxMgcCancelPlan extends LitElement {
  @property({ type: Object }) plan?: SubscriptionSummary;

  @property({ type: Boolean, reflect: true }) requestToCancel = false;

  @query('form') form!: HTMLFormElement;

  protected createRenderRoot() {
    return this;
  }

  updated(changed: PropertyValues) {
    if (changed.has('plan')) {
      console.log('plan updated', this.plan);
    }

    if (changed.has('requestToCancel')) {
      if (this.requestToCancel) {
        this.form?.querySelector('button')?.setAttribute('disabled', 'true');
      }
      console.log('requestToCancel updated', this.requestToCancel);
    }
  }

  async cancelSubscription(e: Event) {
    e.preventDefault();
    this.requestToCancel = true;
    const cancelbutton = this.shadowRoot?.querySelector(`button#${`submit-${this.formId}`}`);
    cancelbutton?.setAttribute('disabled', 'true');
    console.log('canceling subscription', { plan: this.plan });
    this.dispatchEvent(new CustomEvent('cancelSubscription', {
      detail: { plan: this.plan },
    }));
  }

  get formId(): string {
    return `cancel-donation-form-${this.plan?.id}`;
  }

  protected render() {
    return html`
    <section class="cancel-donation">
      <h3>Cancel recurring donation</h3>

      <p>Canceling ends your monthly recurring donation to the Internet Archive, effective immediately. You will not be charged moving forward.</p>
      <p>Canceling does not affect your account or access to the Internet Archive, although you will no longer have access to any of the Monthly Giving Circle perks.</p>
      <p>If you have any questions regarding donations, contact us at <a href="mailto:donations@archive.org">donations@archive.org</a></p>

      <form id=${this.formId} @submit=${(e: Event) => this.cancelSubscription(e)}>
        <input id=${`confirm-${this.formId}`} type="checkbox" required>
        <label for=${`confirm-${this.formId}`}><b>I'm sure I want to cancel my subscription</b></label>
        <button id=${`submit-${this.formId}`} type="submit">I'm sure I want to cancel my recurring donation.</button>
      </form>
    </section>
    `;
  }
}
