/* eslint-disable @typescript-eslint/no-unused-vars */
import { RecaptchaManagerInterface } from '../../src/recaptcha-manager/recaptcha-manager';

export class MockRecaptchaManager implements RecaptchaManagerInterface {
  setupCalled = false;

  async execute(): Promise<string> {
    return 'foo';
  }
  setup(
    container: HTMLElement,
    tabIndex: number,
    theme: ReCaptchaV2.Theme,
    type: ReCaptchaV2.Type,
  ): void {
    this.setupCalled = true;
  }
}
