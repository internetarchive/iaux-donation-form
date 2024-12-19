/* eslint-disable @typescript-eslint/no-unused-vars */

export enum MockGrecaptchaMode {
  Success,
  Expired,
  Error,
}

export class MockGrecaptcha implements ReCaptchaV2.ReCaptcha {
  renderCalled = false;
  executeCalled = false;
  resetCalled = false;
  getResponseCalled = false;

  mode: MockGrecaptchaMode;
  addDelay: boolean;

  callback?: (response: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;

  render(
    container: string | HTMLElement,
    parameters?: ReCaptchaV2.Parameters | undefined,
    inherit?: boolean | undefined,
  ): number {
    this.callback = parameters?.callback?.bind(this);
    this['error-callback'] = parameters?.['error-callback']?.bind(this);
    this['expired-callback'] = parameters?.['expired-callback']?.bind(this);
    this.renderCalled = true;
    return 1;
  }
  reset(opt_widget_id?: number | undefined): void {
    this.resetCalled = true;
  }
  getResponse(opt_widget_id?: number | undefined): string {
    this.getResponseCalled = true;
    return 'foo';
  }
  execute(opt_widget_id?: number | undefined): void {
    this.executeCalled = true;

    if (this.addDelay) {
      setTimeout(this.callCallback, 100);
    } else {
      this.callCallback();
    }
  }

  private callCallback(): void {
    switch (this.mode) {
      case MockGrecaptchaMode.Success:
        if (this.callback) {
          this.callback('foo');
        }
        break;
      case MockGrecaptchaMode.Error:
        if (this['error-callback']) {
          this['error-callback']();
        }
        break;
      case MockGrecaptchaMode.Expired:
        if (this['expired-callback']) {
          this['expired-callback']();
        }
        break;
    }
  }

  constructor(mode: MockGrecaptchaMode, addDelay = false) {
    this.mode = mode;
    this.addDelay = addDelay;
  }
}
