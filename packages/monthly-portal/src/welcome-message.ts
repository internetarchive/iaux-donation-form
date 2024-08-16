import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues } from 'lit';
import { customElement } from 'lit/decorators.js';

const mailToString = `mailto:donations@archive.org?subject=Monthly%20Giving%20Circle%20Inquiry&body=Hi%2C%20I'd%20like%20to%20learn%20more%20about%20the%20Internet%20Archive's%20Monthly%20Giving%20Circle.%20%20Looking%20forward%20to%20hearing%20from%20you%20soon.`;

@customElement('iaux-mgc-welcome')
export class MGCWelcome extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <section>
        <p>Join the Monthly Giving Circle by starting a monthly recurring donation at any level to access benefits and perks:</p>
        <ul>
          <li>Exclusive webinars and virtual learning opportunities</li>
          <li>Discounts at Better World Books</li>
          <li>Access to the curated Monthly Giving Circle newsletter and more!</li>
        </ul>

        <button>Click here to join the Monthly Giving Circle</button>
        <p>Already a monthly donor but don't see your donation details here? Contact us at <a href=${mailToString}>donations@archive.org</a></p>
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

/*
Join the Monthly Giving Circle by starting a monthly recurring donation at any level to access benefits and perks:
Exclusive webinars and virtual learning opportunities
Discounts at Better World Books
Access to the curated Monthly Giving Circle newsletter and more!
Click here to join the Monthly Giving Circle
Already a monthly donor but don't see your donation details here? Contact us at donations@archive.org
*/