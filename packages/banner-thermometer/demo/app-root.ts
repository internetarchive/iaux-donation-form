import { LitElement, html, TemplateResult, CSSResultGroup, css } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import '../src/banner-thermometer';
import {
  CurrentAmountMode,
  DonationBannerThermometer,
  GoalMessageMode,
} from '../src/banner-thermometer';
import { SharedResizeObserver } from '@internetarchive/shared-resize-observer';

@customElement('app-root')
export class AppRoot extends LitElement {
  @query('#thermometer') thermometer!: DonationBannerThermometer;

  @query('#thermometerHeightValue') thermometerHeightValue!: HTMLSpanElement;

  @query('#currentAmountSlider') currentAmountSlider!: HTMLInputElement;

  @query('#currentAmountInput') currentAmountInput!: HTMLInputElement;

  @query('#goalInput') goalInput!: HTMLInputElement;

  @state() defaultGoal = 6_500_000;

  @state() defaultCurrentAmount = 2_350_000;

  private resizeObserver = new SharedResizeObserver();

  render(): TemplateResult {
    return html`
      <div class="thermometer-container">
        <donation-banner-thermometer
          id="thermometer"
          .currentAmount=${this.defaultCurrentAmount}
          .goalAmount=${this.defaultGoal}
          .resizeObserver=${this.resizeObserver}
        >
        </donation-banner-thermometer>
      </div>

      <fieldset>
        <legend>Config</legend>
        <dl>
          <dt><label for="goalInput">Set Goal</label></dt>
          <dd>
            <input
              type="text"
              id="goalInput"
              @input=${this.setGoal}
              value=${this.defaultGoal}
            />
          </dd>

          <dt><label for="setGoal">Set Current Amount</label></dt>
          <dd>
            <input
              type="text"
              id="currentAmountInput"
              @input=${this.setCurrentAmount}
              value=${this.defaultCurrentAmount}
            />
            <input
              type="range"
              id="currentAmountSlider"
              @input=${this.setCurrentAmountSlider}
              min="0"
              max="${this.defaultGoal}"
            />
          </dd>

          <dt><label>Current Amount Mode</label></dt>
          <dd>
            <label>
              <input
                type="radio"
                name="currentAmountModeRadio"
                value="on"
                @click=${this.changeCurrentAmountMode}
                checked
              />
              On
            </label>
            <label>
              <input
                type="radio"
                name="currentAmountModeRadio"
                value="off"
                @click=${this.changeCurrentAmountMode}
              />
              Off
            </label>
          </dd>

          <dt><label>Goal Mode</label></dt>
          <dd>
            <label>
              <input
                type="radio"
                name="goalModeRadio"
                value="off"
                @click=${this.changeGoalMode}
              />
              Off
            </label>
            <label>
              <input
                type="radio"
                name="goalModeRadio"
                value="amount"
                @click=${this.changeGoalMode}
                checked
              />
              Amount
            </label>
            <label>
              <input
                type="radio"
                name="goalModeRadio"
                value="message"
                @click=${this.changeGoalMode}
              />
              Message
            </label>
          </dd>

          <dt><label for="goalMet">Goal Message</label></dt>
          <dd>
            <div>
              <label>Goal Met Message:</label>
              <input
                type="text"
                id="goalMetMessage"
                @input=${this.goalMetMessage}
                value="We've reached our goal!"
              />
            </div>
            <div>
              <label>Goal Near Message:</label>
              <input
                type="text"
                id="goalNearMessage"
                @input=${this.goalNearMessage}
                value="We’ve almost reached our goal!"
              />
            </div>
          </dd>

          <dt><label for="borderColor">Thermometer Border</label></dt>
          <dd>
            <input
              type="text"
              id="borderColor"
              @input=${this.changeBorderColor}
              value="1px solid #31A481"
            />
          </dd>

          <dt><label for="backgroundColor">Background Color</label></dt>
          <dd>
            <input
              type="text"
              id="backgroundColor"
              @input=${this.changeBackgroundColor}
              value="#D1FAED"
            />
          </dd>

          <dt><label for="fillColor">Fill Color</label></dt>
          <dd>
            <input
              type="text"
              id="fillColor"
              @input=${this.changeFillColor}
              value="#31A481"
            />
          </dd>

          <dt><label for="thermometerHeight">Thermometer Height</label></dt>
          <dd>
            <input
              type="range"
              id="thermometerHeight"
              @input=${this.changeThermometerHeight}
              min="10"
              max="100"
              value="20"
            />
            <span id="thermometerHeightValue">20px</span>
          </dd>
        </dl>
      </fieldset>
    `;
  }

  changeThermometerHeight(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.height = value + 'px';
    const numberValue = parseFloat(value);
    this.thermometerHeightValue.innerHTML = `${Math.round(numberValue)}px`;
  }

  changeGoalMode(e: Event): void {
    if (!e.target) return;
    const target = e.target as HTMLInputElement;
    const mode = target.value as GoalMessageMode;
    this.thermometer.goalMessageMode = mode;
  }

  changeCurrentAmountMode(e: Event): void {
    if (!e.target) return;
    const target = e.target as HTMLInputElement;
    const mode = target.value as CurrentAmountMode;
    this.thermometer.currentAmountMode = mode;
  }

  setGoal(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.currentAmountSlider.max = value;
    this.thermometer.goalAmount = parseFloat(value);
  }

  setCurrentAmount(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.currentAmount = parseFloat(value);
  }

  setCurrentAmountSlider(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.currentAmountInput.value = value;
    this.thermometer.currentAmount = parseFloat(value);
  }

  goalMetMessage(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.goalReachedMessage = value;
  }

  goalNearMessage(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.goalNearMessage = value;
  }

  changeBorderColor(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.setProperty('--bannerThermometerBorder', value);
  }

  changeFillColor(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.setProperty(
      '--bannerThermometerProgressColor',
      value,
    );
  }

  changeBackgroundColor(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.setProperty(
      '--bannerThermometerBackgroundColor',
      value,
    );
  }

  changeMarkerBorder(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.setProperty(
      '--bannerThermometerMarkerBorder',
      value,
    );
  }

  static get styles(): CSSResultGroup {
    return css`
      #thermometer {
        height: 20px;
      }

      .thermometer-container {
        margin-bottom: 2rem;
      }
    `;
  }
}
