import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
} from 'lit-element';

export enum IconSpaceOption {
  IconSpace = 'icon-space',
  NoIconSpace = 'no-icon-space',
}

@customElement('badged-input')
export class BadgedInput extends LitElement {
  @property({ type: Boolean }) error = false;

  @property({ type: Object }) icon?: TemplateResult;

  @property({ type: Boolean }) required = false;

  @property({ type: String }) iconSpaceOption: IconSpaceOption = IconSpaceOption.IconSpace;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div class="input-wrapper ${this.errorClass} ${this.iconSpaceOptionClass}">
        <div class="icon-container">${this.icon}</div>
        ${this.required
          ? html`
              <div class="required-indicator">*</div>
            `
          : ''}
        <slot></slot>
      </div>
    `;
  }

  private get errorClass(): string {
    return this.error ? 'error' : '';
  }

  private get iconSpaceOptionClass(): string {
    return this.iconSpaceOption === IconSpaceOption.NoIconSpace ? 'no-icon-space' : '';
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

      .input-wrapper.no-icon-space .icon-container {
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
    `;
  }
}
