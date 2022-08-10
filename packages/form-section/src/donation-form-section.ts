import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export enum DonationFormSectionBadgeMode {
  HideBadge = 'hidebadge',
  ShowBadge = 'showbadge',
  HideBadgeLeaveSpacing = 'hidebadgeleavespacing',
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
      <div class="container ${this.badgeMode}">
        <div class="badge-container">
          <div class="badge">${this.sectionBadge}</div>
        </div>
        <div class="content-container">
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
    const badgeTransition = css`var(--formSectionBadgeTransition, 0.25s ease-out)`;
    const badgeMargin = css`var(--formSectionBadgeMargin, 1rem)`;
    const badgeBackgroundColor = css`var(--formSectionBadgeBackgroundColor, #333)`;
    const badgeRadius = css`var(--formSectionBadgeRadius, 1.2rem)`;
    const badgeWidth = css`calc(${badgeRadius} * 2)`;
    const badgeFontSize = css`var(--formSectionBadgeFontSize, 1.8rem)`;
    const badgeFontWeight = css`var(--formSectionBadgeFontWeight, bold)`;
    const badgeFontColor = css`var(--formSectionBadgeFontColor, #fff)`;
    const titleFontSize = css`var(--formSectionTitleFontSize, 1.8rem)`;
    const titleFontWeight = css`var(--formSectionTitleFontWeight, bold)`;

    const sectionContentBackgroundColor = css`var(--formSectionContentBackgroundColor, transparent)`;

    const textColor = css`var(--formSectionTextColor, #333)`;

    const lineHeightCss = css`calc(${badgeRadius} * 2)`;

    return css`
      :host {
        display: block;
        background-color: ${sectionContentBackgroundColor};
        color: ${textColor};
      }
      .container {
        position: relative;
        padding: 0.5rem;
      }

      .content-container {
        position: relative;
        left: calc(${badgeWidth} + ${badgeMargin});
        width: calc(100% - (${badgeWidth} + ${badgeMargin}));
        transition: ${badgeTransition};
        z-index: 1;
      }

      .hidebadge .content-container {
        left: 0;
        width: 100%;
      }

      .hidebadge .badge-container {
        display: none;
      }

      .hidebadgeleavespacing .badge {
        display: none;
      }

      .badge-container {
        position: absolute;
        width: ${badgeWidth};
      }

      .badge {
        background-color: ${badgeBackgroundColor};
        color: ${badgeFontColor};
        width: ${badgeWidth};
        height: ${badgeWidth};
        border-radius: ${badgeRadius};
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: ${badgeFontWeight};
        font-size: ${badgeFontSize};
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
