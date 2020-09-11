import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
} from 'lit-element';

export enum DonationFormSectionBadgeMode {
  HideBadge = 'hidebadge',
  ShowBadge = 'showbadge',
}

@customElement('donation-form-section')
export class DonationFormSection extends LitElement {
  @property({ type: String }) sectionBadge = '0';

  @property({ type: String }) headline: string | undefined;

  @property({ type: String }) badgeMode: DonationFormSectionBadgeMode =
    DonationFormSectionBadgeMode.ShowBadge;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div class="container">
        <div class="number-container">
          <div class="number">${this.sectionBadge}</div>
        </div>
        <div class="content-container ${this.badgeMode}">
          ${this.headline
            ? html` <div class="title">${this.headline}</div> `
            : ''}
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const numberTransition = css`var(--formSectionNumberTransition, 0.25s ease-out)`;
    const numberMargin = css`var(--formSectionNumberMargin, 1rem)`;
    const numberBackgroundColor = css`var(--formSectionNumberBackgroundColor, #333)`;
    const numberRadius = css`var(--formSectionNumberRadius, 1.2rem)`;
    const numberWidth = css`calc(${numberRadius} * 2)`;
    const numberFontSize = css`var(--formSectionNumberFontSize, 1.8rem)`;
    const numberFontWeight = css`var(--formSectionNumberFontWeight, bold)`;
    const numberFontColor = css`var(--formSectionNumberFontColor, #fff)`;
    const titleFontSize = css`var(--formSectionTitleFontSize, 1.8rem)`;
    const titleFontWeight = css`var(--formSectionTitleFontWeight, bold)`;

    const sectionContentBackgroundColor = css`var(--formSectionContentBackgroundColor, white)`;

    const lineHeightCss = css`calc(${numberRadius} * 2)`;

    return css`
      .container {
        position: relative;
        margin-bottom: 1rem;
      }

      .content-container {
        position: relative;
        left: calc(${numberWidth} + ${numberMargin});
        width: calc(100% - (${numberWidth} + ${numberMargin}));
        transition: ${numberTransition};
        z-index: 1;
        background-color: ${sectionContentBackgroundColor};
      }

      .content-container.hidebadge {
        left: 0;
        width: 100%;
      }

      .number-container {
        position: absolute;
        width: ${numberWidth};
      }

      .number {
        background-color: ${numberBackgroundColor};
        color: ${numberFontColor};
        width: ${numberWidth};
        height: ${numberWidth};
        border-radius: ${numberRadius};
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: ${numberFontWeight};
        font-size: ${numberFontSize};
      }

      .title {
        line-height: ${lineHeightCss};
        margin-bottom: 0.5rem;
        font-size: ${titleFontSize};
        font-weight: ${titleFontWeight};
      }
    `;
  }
}
