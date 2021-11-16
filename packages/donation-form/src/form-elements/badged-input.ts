import { LitElement, html, css, CSSResult, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export enum SpacerOption {
  LeaveSpace = 'leave-space',
  CompressSpace = 'compress-space',
}

@customElement('badged-input')
export class BadgedInput extends LitElement {
  @property({ type: Boolean }) error = false;

  @property({ type: Object }) icon?: TemplateResult;

  @property({ type: Boolean }) required = false;

  /**
   * If the icon is hidden, should the space remain or be compressed
   *
   * @type {SpacerOption}
   * @memberof BadgedInput
   */
  @property({ type: String }) iconSpaceOption: SpacerOption = SpacerOption.LeaveSpace;

  /**
   * When the required indicator is hidden, should the spacing remain
   *
   * This is useful for aligning many fields where some may not be required
   *
   * @type {SpacerOption}
   * @memberof BadgedInput
   */
  @property({ type: String }) requiredIndicatorSpaceOption: SpacerOption = SpacerOption.LeaveSpace;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div class="input-wrapper ${this.errorClass} ${this.iconSpaceOptionClass}">
        <div class="icon-container">${this.icon}</div>
        <div class="required-indicator ${this.requiredIndicatorSpaceOption}">
          ${this.required
            ? html`
                *
              `
            : nothing}
        </div>

        <slot></slot>
      </div>
    `;
  }

  private get errorClass(): string {
    return this.error ? 'error' : '';
  }

  private get iconSpaceOptionClass(): string {
    return this.iconSpaceOption === SpacerOption.CompressSpace ? 'compress-space' : '';
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const borderCss = css`var(--inputBorder, 1px solid #d9d9d9)`;
    const errorColorCss = css`var(--badgedInputBorderErrorColor, red)`;
    const iconSize = css`var(--badgedInputIconSize, 1.4rem)`;
    const iconSpacerWidth = css`var(--badgedInputIconSpacerWidth, 3rem)`;
    const noIconSpacerWidth = css`var(--badgedInputNoIconSpacerWidth, 1rem)`;
    const fieldHeight = css`var(--badgedInputHeight, 3rem)`;
    const requiredIndicatorColor = css`var(--badgedInputRequiredIndicatorColor, red)`;
    const requiredIndicatorMargin = css`var(--badgedInputRequiredIndicatorMargin, 0 0.25rem 0 0)`;
    const requiredIndicatorFontSize = css`var(--badgedInputRequiredIndicatorFontSize, 2rem)`;

    return css`
      .input-wrapper {
        border: ${borderCss};
        height: ${fieldHeight};
        display: flex;
        align-items: center;
      }

      .input-wrapper.error {
        box-shadow: inset 0px 0px 0px 1px ${errorColorCss};
        border-color: ${errorColorCss};
      }

      .input-wrapper.compress-space .icon-container {
        width: ${noIconSpacerWidth};
      }

      .icon-container {
        width: ${iconSpacerWidth};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .icon-container svg {
        height: ${iconSize};
      }

      .required-indicator {
        color: ${requiredIndicatorColor};
        font-size: ${requiredIndicatorFontSize};
        margin: ${requiredIndicatorMargin};
      }

      .required-indicator.leave-space {
        width: 0.5em;
      }
    `;
  }
}
