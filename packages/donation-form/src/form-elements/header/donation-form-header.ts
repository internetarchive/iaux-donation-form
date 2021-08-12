import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
  query,
} from 'lit-element';

import {
  defaultDonationAmounts,
  DonationPaymentInfo,
} from '@internetarchive/donation-form-data-models';

import '@internetarchive/donation-form-edit-donation';
import { DonationFormEditDonation } from '@internetarchive/donation-form-edit-donation';

export enum DonationFormHeaderMode {
  Summary = 'summary',
  Edit = 'edit',
}

@customElement('donation-form-header')
export class DonationFormHeader extends LitElement {
  @property({ type: Object }) donationInfo?: DonationPaymentInfo;

  @property({ type: String }) mode: DonationFormHeaderMode = DonationFormHeaderMode.Edit;

  @property({ type: Array }) amountOptions: number[] = defaultDonationAmounts;

  @query('edit-donation') editDonation?: DonationFormEditDonation;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      ${this.currentTemplate}
    `;
  }

  private get currentTemplate(): TemplateResult {
    switch (this.mode) {
      case DonationFormHeaderMode.Summary:
        return this.donationSummaryTemplate;
      case DonationFormHeaderMode.Edit:
        return this.editDonationTemplate;
    }
  }

  private get editDonationTemplate(): TemplateResult {
    return html`
      <donation-form-edit-donation
        .donationInfo=${this.donationInfo}
        .amountOptions=${this.amountOptions}
        @donationInfoChanged=${this.donationInfoChanged}
        @showSummaryClicked=${this.showSummaryClicked}
        @editDonationError=${this.editDonationError}
      >
      </donation-form-edit-donation>
    `;
  }

  private get donationSummaryTemplate(): TemplateResult {
    return html`
      <donation-summary .donationInfo=${this.donationInfo} @editClicked=${this.summaryEditClicked}>
      </donation-summary>
    `;
  }

  private donationInfoChanged(e: CustomEvent): void {
    this.donationInfo = e.detail.donationInfo as DonationPaymentInfo;
    const event = new CustomEvent('donationInfoChanged', {
      detail: { donationInfo: this.donationInfo },
    });
    this.dispatchEvent(event);
  }

  private editDonationError(e: CustomEvent): void {
    const event = new CustomEvent('editDonationError', { detail: e.detail });
    this.dispatchEvent(event);
  }

  private summaryEditClicked(): void {
    this.mode = DonationFormHeaderMode.Edit;
  }

  private showSummaryClicked(): void {
    this.mode = DonationFormHeaderMode.Summary;
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    return css``;
  }
}
