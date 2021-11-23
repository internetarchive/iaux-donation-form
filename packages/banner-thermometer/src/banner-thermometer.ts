import {
  html,
  css,
  LitElement,
  TemplateResult,
  CSSResult,
  PropertyValues,
  nothing,
} from 'lit';
import { property, customElement, query, state } from 'lit/decorators.js';
import type {
  SharedResizeObserverResizeHandlerInterface,
  SharedResizeObserverInterface,
} from '@internetarchive/shared-resize-observer';

export type GoalMessageMode = 'off' | 'amount' | 'message';

export type CurrentAmountMode = 'on' | 'off';

@customElement('donation-banner-thermometer')
export class DonationBannerThermometer
  extends LitElement
  implements SharedResizeObserverResizeHandlerInterface {
  @property({ type: String }) goalMessageMode: GoalMessageMode = 'amount';

  @property({ type: String }) goalNearMessage =
    'We’ve almost reached our goal!';

  @property({ type: String }) goalReachedMessage = "We've reached our goal!";

  @property({ type: Number }) goalAmount = 7_500_000;

  @property({ type: String }) currentAmountMode: CurrentAmountMode = 'on';

  @property({ type: Number }) currentAmount = 0;

  @property({ type: Object }) resizeObserver?: SharedResizeObserverInterface;

  @query('.thermometer-value') private thermometerValue!: HTMLDivElement;

  @query('.thermometer-fill') private thermometerFill!: HTMLDivElement;

  @state() private thermometerValueWidth = 0;

  @state() private thermometerFillWidth = 0;

  render(): TemplateResult {
    return html`
      <div
        class="container"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="${this.goalAmount}"
        aria-valuenow="${this.currentAmount}"
        aria-valuetext="${this.currentAmountDisplayValue}"
      >
        <div class="thermometer-message-container">
          <div class="thermometer-container">
            <div
              class="thermometer-background ${this.thermometerValuePosition}"
            >
              <div
                class="thermometer-fill"
                style="width: ${this.percentComplete}%"
              >
                ${this.thermometerValuePosition === 'value-left'
                  ? this.thermometerValueTemplate
                  : nothing}
              </div>
              ${this.thermometerValuePosition === 'value-right'
                ? this.thermometerValueTemplate
                : nothing}
            </div>
          </div>
          ${this.goalMessageMode !== 'off'
            ? html` <div class="donate-goal">${this.currentGoalMessage}</div> `
            : nothing}
        </div>
      </div>
    `;
  }

  private get thermometerValueTemplate(): TemplateResult {
    return this.currentAmountMode === 'off'
      ? html`${nothing}`
      : html`
          <div class="thermometer-value">${this.currentAmountDisplayValue}</div>
        `;
  }

  /**
   * Determines the position of the thermometer value. (Left or right of the thermometer fill)
   */
  private get thermometerValuePosition(): 'value-left' | 'value-right' {
    const buffer = 10;
    return this.thermometerValueWidth + buffer < this.thermometerFillWidth
      ? 'value-left'
      : 'value-right';
  }

  updated(changed: PropertyValues): void {
    if (changed.has('resizeObserver')) {
      this.setupResizeObserver();
    }
  }

  disconnectedCallback(): void {
    this.disconnectResizeObserver();
  }

  /** @inheritdoc */
  handleResize(entry: ResizeObserverEntry): void {
    switch (entry.target) {
      /* istanbul ignore next */
      case this.shadowRoot?.host:
        this.style.setProperty(
          '--bannerThermometerHeight',
          entry.contentRect.height + 'px'
        );
        break;
      case this.thermometerValue:
        this.thermometerValueWidth = entry.contentRect.width;
        break;
      case this.thermometerFill:
        this.thermometerFillWidth = entry.contentRect.width;
        break;
    }
  }

  private setupResizeObserver(): void {
    this.disconnectResizeObserver();
    /* istanbul ignore next */
    if (!this.shadowRoot?.host || !this.resizeObserver) return;
    this.resizeObserver.addObserver({
      handler: this,
      target: this.shadowRoot.host,
    });

    this.resizeObserver.addObserver({
      handler: this,
      target: this.thermometerValue,
    });

    this.resizeObserver.addObserver({
      handler: this,
      target: this.thermometerFill,
    });
  }

  private disconnectResizeObserver(): void {
    /* istanbul ignore next */
    if (!this.shadowRoot?.host || !this.resizeObserver) return;
    this.resizeObserver.removeObserver({
      handler: this,
      target: this.shadowRoot.host,
    });

    this.resizeObserver.removeObserver({
      handler: this,
      target: this.thermometerValue,
    });

    this.resizeObserver.removeObserver({
      handler: this,
      target: this.thermometerFill,
    });
  }

  private get goalMessage(): string {
    return this.currentAmount >= this.goalAmount
      ? this.goalReachedMessage
      : this.goalNearMessage;
  }

  private get currentAmountDisplayValue(): string {
    return this.formatNumber(this.currentAmount);
  }

  private get goalAmountDisplayValue(): string {
    return this.formatNumber(this.goalAmount);
  }

  private formatNumber(number: number): string {
    if (number === 0) return '$0';
    const suffix = 'MM';
    const divisor = 1_000_000;
    const result = number / divisor;
    const roundToOne = result < 10;
    let rounded = 0;
    if (roundToOne) {
      rounded = Math.round((result + Number.EPSILON) * 10) / 10;
    } else {
      rounded = Math.round(result);
    }
    return `$${rounded}${suffix}`;
  }

  private get currentGoalMessage(): string {
    switch (this.goalMessageMode) {
      case 'amount':
        return `${this.goalAmountDisplayValue} goal`;
      case 'message':
        return this.goalMessage;
      case 'off':
        return '';
    }
  }

  private get percentComplete(): number {
    return Math.min((this.currentAmount / this.goalAmount) * 100, 100);
  }

  static get styles(): CSSResult {
    const thermometerHeight = css`var(--bannerThermometerHeight, 20px)`;
    const currentValueLeftColor = css`var(--bannerThermometerCurrentValueLeftColor, #fff)`;
    const progressColor = css`var(--bannerThermometerProgressColor, #23765D)`;
    const currentValueRightColor = css`var(--bannerThermometerCurrentValueRightColor, ${progressColor})`;
    const backgroundColor = css`var(--bannerThermometerBackgroundColor, #B8F5E2)`;
    const borderStyle = css`var(--bannerThermometerBorder, 1px solid ${progressColor})`;
    const borderRadius = css`var(--bannerThermometerBorderRadius, calc(${thermometerHeight} / 2))`;
    const goalMessagePadding = css`var(--bannerThermometerGoalMessagePadding, 0 10px)`;
    const goalValueColor = css`var(--bannerThermometerGoalValueColor, #2c2c2c)`;

    return css`
      :host {
        display: block;
      }

      .container {
        height: 100%;
      }

      .thermometer-message-container {
        height: 100%;
        display: flex;
        align-items: center;
      }

      .thermometer-container {
        height: 100%;
        flex: 1;
      }

      .thermometer-background {
        background-color: ${backgroundColor};
        padding: 0;
        height: 100%;
        border-radius: ${borderRadius};
        border: ${borderStyle};
        overflow: hidden;
        display: flex;
        align-items: center;
      }

      .thermometer-fill {
        background-color: ${progressColor};
        text-align: right;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      .thermometer-value {
        font-weight: bold;
      }

      .value-left .thermometer-value {
        color: ${currentValueLeftColor};
        padding: 0 0.5rem 0 1rem;
      }

      .value-right .thermometer-value {
        color: ${currentValueRightColor};
        padding: 0 1rem 0 0.5rem;
      }

      .donate-goal {
        text-align: left;
        padding: ${goalMessagePadding};
        text-transform: uppercase;
        font-weight: bold;
        color: ${goalValueColor};
      }
    `;
  }
}
