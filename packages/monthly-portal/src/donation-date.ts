import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type SubscriptionSummary from './models/subscription-summary';

import './form-elements/contact-form/contact-form';

@customElement('iaux-mgc-edit-donation-date')
export class MonthlyGivingCircle extends LitElement {
  @property({ type: String }) displayDate: string = '';

  protected createRenderRoot() {
    return this;
  }

  get dateFormatted(): string {
    return '';
  }

  get maxDate(): string {
    return '';
  }

  get minDate(): string {
    return '';
  }

  @query('form#edit-donation-date') form!: HTMLFormElement

  protected render() {
    return html`
    <section>
      <h3>Donation date</h3>
      <form id="edit-donation-date">
        <p>${this.displayDate}</p>
        <input type="date" id="date" name="new-date" value=${this.dateFormatted} min=${this.minDate} max=${this.maxDate} />
        <button class="ia-button" type="submit" @click=${(e: Event)=> {
          e.preventDefault();
          const newDate = this.form.querySelector('input[name="new-date"]') as HTMLInputElement;
          const newDateValue = newDate!.value;
          console.log('update date', { newDateValue, displayDate: this.displayDate });
        }}>Update</button>
        <button type="button" @click=${(e: Event) => {
          e.preventDefault();
          const newDate = this.form.querySelector('input[name="new-date"]') as HTMLInputElement;
          const newDateValue = newDate!.value;
          console.log('cancel date', { newDateValue, displayDate: this.displayDate });
        }}>Cancel</button>
      </form>
    </section>
      
    `;
  }
}
