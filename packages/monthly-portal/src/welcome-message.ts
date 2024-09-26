import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const mailToString = `mailto:donations@archive.org?subject=Monthly%20Giving%20Circle%20Inquiry&body=Hi%2C%20I'd%20like%20to%20learn%20more%20about%20the%20Internet%20Archive's%20Monthly%20Giving%20Circle.%20%20Looking%20forward%20to%20hearing%20from%20you%20soon.`;

@customElement('iaux-mgc-welcome')
export class MGCWelcome extends LitElement {
  @property({ type: String }) patronName: string = '';

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

        <a href=${this.mailToInquiryLink} class="link join-mgc">Click here to join the Monthly Giving Circle</a>
        <p>Already a monthly donor but don't see your donation details here? Contact us at <a class="link" href=${mailToString}>donations@archive.org</a></p>
      </section>
    `;
  }

  get mailToInquiryLink() {
    const mainBody = `mailto:donations@archive.org?subject=Tell%20me%20more%20about%20the%20Monthly%20Giving%20Circle&body=Hello%2C%20I%20am%20an%20archive%20member%20and%20want%20to%20know%20about%20the%20Monthly%20Giving%20Circle.%20%20Best%2C%20`;
    const encodedName = encodeURIComponent(this.patronName);
    return `${mainBody}${encodedName}`;
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