/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockVenmoClient implements braintree.Venmo {
  tokenizeCalled = false;

  async create(options: {
    client?: braintree.Client | undefined;
    authorization?: string | undefined;
    allowNewBrowserTab?: boolean | undefined;
    ignoreHistoryChanges?: boolean | undefined;
    profileId?: string | undefined;
    deepLinkReturnUrl?: string | undefined;
  }): Promise<braintree.Venmo> {
    return this;
  }

  VERSION = 'foo';

  isBrowserSupported(): boolean {
    return this.browserSupported;
  }

  hasTokenizationResult(): boolean {
    return false;
  }

  async tokenize(
    options?: { processResultsDelay?: number | undefined } | undefined,
  ): Promise<braintree.VenmoTokenizePayload> {
    const payload = {
      nonce: 'foo',
      type: 'bar',
      details: { username: 'boo' },
    };

    this.tokenizeCalled = true;

    return payload;
  }

  async teardown(): Promise<void> {
    return;
  }

  constructor(options: { isBrowserSupported: boolean }) {
    this.browserSupported = options.isBrowserSupported;
  }

  private browserSupported: boolean;
}
