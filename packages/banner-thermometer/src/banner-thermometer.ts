import {
  html,
  css,
  LitElement,
  property,
  TemplateResult,
  CSSResult,
  customElement,
} from 'lit-element';
import currency from 'currency.js';

export enum GoalMessageMode {
  ShowGoal = 'showgoal',
  GoalMet = 'goalmet',
}

@customElement('donation-banner-thermometer')
export class DonationBannerThermometer extends LitElement {
  @property({ type: String }) goalMessageMode: GoalMessageMode =
    GoalMessageMode.ShowGoal;

  @property({ type: String }) goalMetMessage = "We've reached our goal!";

  @property({ type: Number }) goalAmount = 6_500_000;

  @property({ type: Number }) currentAmount = 2_350_000;

  // this is not the same as the currentAmount / goal calculation because we show different values
  @property({ type: Number }) percentComplete = 36;

  private get currentAmountDisplayValue(): string {
    return this.currencyFormatted(this.currentAmount);
  }

  private get goalAmountDisplayValue(): string {
    return this.currencyFormatted(this.goalAmount);
  }

  private currencyFormatted(value: number): string {
    return currency(value, {
      symbol: '$',
      precision: 0,
    }).format();
  }

  private get goalMessage(): string {
    switch (this.goalMessageMode) {
      case GoalMessageMode.ShowGoal:
        return this.goalAmountDisplayValue;
      case GoalMessageMode.GoalMet:
        return this.goalMetMessage;
    }
  }

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
            <div class="thermometer-background">
              <div
                class="thermometer-fill"
                style="width: ${this.percentComplete}%"
              ></div>
            </div>
            <div
              class="theremometer-value-container"
              style="width: ${this.percentComplete}%"
            >
              <div class="thermometer-value-indicator"></div>
              <div class="thermometer-value">
                ${this.currentAmountDisplayValue}
              </div>
            </div>
          </div>
          <div class="donate-goal">${this.goalMessage}</div>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResult {
    const thermometerHeight = css`var(--bannerThermometerHeight, 30px)`;
    const borderStyle = css`var(--bannerThermometerBorder, 1px solid #31A481)`;
    const backgroundColor = css`var(--bannerThermometerBackgroundColor, #D1FAED)`;
    const progressColor = css`var(--bannerThermometerProgressColor, #31A481)`;
    const borderRadius = css`var(--bannerThermometerBorderRadius, 20px)`;
    const markerTop = css`var(--bannerThermometerMarkerTop, 50%)`;
    const markerHeight = css`var(--bannerThermometerMarkerHeight, 75%)`;
    const markerBorder = css`var(--bannerThermometerMarkerBorder, ${borderStyle})`;
    const progressValueLineHeight = css`var(--bannerThermometerProgressValueLineHeight, 1)`;
    const goalMessageLineHeight = css`var(--bannerThermometerGoalMessageLineHeight, 1)`;
    const goalMessagePadding = css`var(--bannerThermometerGoalMessagePadding, 0 10px)`;

    return css`
      :host {
        display: block;
        /* height: 100%; */
      }

      .container {
        height: 100%;
      }

      .thermometer-message-container {
        height: ${thermometerHeight};
        display: flex;
        align-items: center;
      }

      .thermometer-container {
        height: ${thermometerHeight};
        flex: 1;
        position: relative;
      }

      .thermometer-background {
        background-color: ${backgroundColor};
        padding: 0;
        height: 100%;
        border-radius: ${borderRadius};
        border: ${borderStyle};
        overflow: hidden;
      }

      .thermometer-fill {
        background-color: ${progressColor};
        text-align: right;
        height: 100%;
        border-radius: ${borderRadius};
      }

      .theremometer-value-container {
        position: absolute;
        height: ${markerHeight};
        top: ${markerTop};
      }

      .thermometer-value-indicator {
        height: 100%;
        border-right: ${markerBorder};
      }

      .thermometer-value {
        line-height: ${progressValueLineHeight};
        text-align: right;
      }

      .donate-goal {
        text-align: left;
        padding: ${goalMessagePadding};
        text-transform: uppercase;
        line-height: ${goalMessageLineHeight};
      }
    `;
  }
}
