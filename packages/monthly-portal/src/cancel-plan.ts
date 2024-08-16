import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type SubscriptionSummary from './models/subscription-summary';

import './form-elements/contact-form/contact-form';

@customElement('iaux-mgc-cancel-plan')
export class MonthlyGivingCircle extends LitElement {
  @property({ type: String }) baseHost: string = 'archive.org';

  @property({ type: String }) giverId: string = '';

  @property({ type: Array }) activePlans: SubscriptionSummary[] = [];

  @property({ type: String }) planIdToDisplay = '';

  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
    <section>
      <h3>Cancel Plan</h3>
    </section>
      
    `;
  }
}
