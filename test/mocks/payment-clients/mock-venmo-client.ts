/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockVenmoClient implements braintree.Venmo {
  async create(options: {
    client?: braintree.Client | undefined;
    authorization?: string | undefined;
    allowNewBrowserTab?: boolean | undefined;
    ignoreHistoryChanges?: boolean | undefined;
    profileId?: string | undefined;
    deepLinkReturnUrl?: string | undefined;
  }): Promise<braintree.Venmo> {
    return new MockVenmoClient();
  }

  VERSION = 'foo';

  isBrowserSupported(): boolean {
    return true;
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

    return payload;
  }

  async teardown(): Promise<void> {
    return;
  }
}
