export interface RecaptchaManagerInterface {
  execute(): Promise<string>;
  setup(
    container: HTMLElement,
    tabIndex: number,
    theme: ReCaptchaV2.Theme,
    type: ReCaptchaV2.Type,
  ): void;
}

export class RecaptchaManager implements RecaptchaManagerInterface {
  private grecaptchaLibrary: ReCaptchaV2.ReCaptcha;

  private siteKey: string;

  constructor(options: { grecaptchaLibrary: ReCaptchaV2.ReCaptcha; siteKey: string }) {
    this.grecaptchaLibrary = options.grecaptchaLibrary;
    this.siteKey = options.siteKey;
  }

  private executionSuccessBlock?: (token: string) => void;

  private executionExpiredBlock?: () => void;

  private executionErrorBlock?: () => void;

  private isExecuting = false;

  /**
   * Execute Recaptcha and return a Promise containing the response token.
   *
   * This is an interesting flow.. we call `execute()` here, but have to wait for the
   * response and expiration handlers that we bind during the inital `setup` call.
   * For consumers, we want to be able to just call `execute()` and wait for a response.
   * To allow this, we assign two callbacks:
   * - `executionSuccessBlock`
   * - `executionExpiredBlock`
   *
   * We then call those callbacks from inside `responseHandler` and `expiredHandler` to
   * either resolve or reject the Promise.
   *
   * ie:
   *
   * try {
   *   const recaptchaResult = await recaptchaManager.execute();
   *   console.log('recaptcha token:', recaptchaResult);
   * } catch {
   *   console.error('something happened')
   * }
   *
   * @returns {Promise<string>}
   * @memberof RecaptchaManager
   */
  execute(): Promise<string> {
    if (this.isExecuting) {
      this.finishExecution();
    }
    this.isExecuting = true;
    return new Promise((resolve, reject) => {
      this.executionSuccessBlock = (token: string): void => {
        this.finishExecution();
        resolve(token);
      };

      this.executionExpiredBlock = (): void => {
        this.finishExecution();
        reject('expired');
      };

      this.executionErrorBlock = (): void => {
        this.finishExecution();
        reject('error');
      };

      this.grecaptchaLibrary.execute();
    });
  }

  private finishExecution(): void {
    this.isExecuting = false;
    this.grecaptchaLibrary.reset();
  }

  setup(
    container: HTMLElement,
    tabIndex: number,
    theme: ReCaptchaV2.Theme,
    type: ReCaptchaV2.Type,
  ): void {
    this.grecaptchaLibrary.render(container, {
      callback: this.responseHandler.bind(this),
      'expired-callback': this.expiredHandler.bind(this),
      'error-callback': this.errorHandler.bind(this),
      sitekey: this.siteKey,
      tabindex: tabIndex,
      theme: theme,
      type: type,
      size: 'invisible',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private responseHandler(response: any): void {
    if (this.executionSuccessBlock) {
      this.executionSuccessBlock(response);
      this.executionSuccessBlock = undefined;
    }
  }

  private expiredHandler(): void {
    if (this.executionExpiredBlock) {
      this.executionExpiredBlock();
      this.executionExpiredBlock = undefined;
    }
  }

  private errorHandler(): void {
    if (this.executionErrorBlock) {
      this.executionErrorBlock();
      this.executionErrorBlock = undefined;
    }
  }
}
