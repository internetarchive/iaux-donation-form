import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type donation = {
  status: string;
  amount: number;
  date: string;
  id: string;
};


@customElement('iaux-mgc-recent-donations')
export class MGCWelcome extends LitElement {
  @property({ type: Array }) donations = [];

  protected createRenderRoot() {
    return this;
  }

  donationAmountFormatted(amount: number) {
    return `USD ${amount}`;
  }

  emailReceipt(donation: donation) {
    this.dispatchEvent(new CustomEvent('EmailReceiptRequest', {
      detail: {
        donation
      }
    }));
  }

  protected render() {
    return html`
      <h3>Recent donations <button class="primary" @click=${() => this.dispatchEvent(new CustomEvent('close'))}>Back to account settings</button></h3>
      <section id="recent-donations-list">
        <table>
        <tr>
          <th>Donor</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        ${ this.donations.length ? this.donations.map((donation: donation) => {
          const emailUnavailable = donation.status === 'pending';
          return html`
            <tr id=${`donation-${donation.id}`}>
              <td>${donation.date}</td>
              <td>${this.donationAmountFormatted(donation.amount)}</td>
              <td class="status">${donation.status}</td>
              <td>
                <button class="link" @click=${() => {
                  if (emailUnavailable) return;
                  this.emailReceipt(donation);
                }} ?disabled=${emailUnavailable}>
                ${ emailUnavailable ? 'Unavailable' : 'Email receipt' }
                </button>
              </td>
            </tr>
          `;
        }) : html`<p>No  recent donations found</p>`}
        </table>
      </section>
    `;
  }
}
