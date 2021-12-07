import { expect } from '@open-wc/testing';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { MockHostedFieldsClient } from '../../mocks/payment-clients/mock-hostedfields-client';
import { mockHostedFieldTokenizePayload } from '../../mocks/payment-clients/mock-hostedfieldtokenizepayload';
import { CreditCardHandler } from '../../../src/braintree-manager/payment-providers/credit-card/credit-card';
import { MockHostedFieldContainer } from '../../mocks/mock-hosted-fields-container';
import { HostedFieldConfiguration } from '../../../src/braintree-manager/payment-providers/credit-card/hosted-field-configuration';
import Sinon from 'sinon';
import {
  mockHostedFieldStyle,
  mockHostedFieldFieldOptions,
  mockHostedFieldConfig,
} from '../../mocks/mock-hosted-fields-config';

const sandbox = Sinon.createSandbox();

describe('CreditCardHandler', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('can tokenize the hosted fields', async () => {
    const braintreeManager = new MockBraintreeManager();
    const client = new MockHostedFieldsClient({
      mockHostedFieldTokenizePayload: mockHostedFieldTokenizePayload,
    });

    const handler = new CreditCardHandler({
      braintreeManager: braintreeManager,
      hostedFieldClient: client,
      hostedFieldConfig: mockHostedFieldConfig,
    });

    const payload = await handler.tokenizeHostedFields();

    expect(payload?.nonce).to.equal(mockHostedFieldTokenizePayload.nonce);
  });

  it('can mark field errors', async () => {
    const braintreeManager = new MockBraintreeManager();
    const client = new MockHostedFieldsClient();
    const mockHostedFieldContainer = new MockHostedFieldContainer();
    const mockHostedFieldConfig: HostedFieldConfiguration = new HostedFieldConfiguration({
      hostedFieldStyle: mockHostedFieldStyle,
      hostedFieldFieldOptions: mockHostedFieldFieldOptions,
      hostedFieldContainer: mockHostedFieldContainer,
    });
    const handler = new CreditCardHandler({
      braintreeManager: braintreeManager,
      hostedFieldClient: client,
      hostedFieldConfig: mockHostedFieldConfig,
    });
    handler.markFieldErrors([]);
    expect(mockHostedFieldContainer.markErrorsCalled).to.be.true;
  });

  it('can remove field errors', async () => {
    const braintreeManager = new MockBraintreeManager();
    const client = new MockHostedFieldsClient();
    const mockHostedFieldContainer = new MockHostedFieldContainer();
    const mockHostedFieldConfig: HostedFieldConfiguration = new HostedFieldConfiguration({
      hostedFieldStyle: mockHostedFieldStyle,
      hostedFieldFieldOptions: mockHostedFieldFieldOptions,
      hostedFieldContainer: mockHostedFieldContainer,
    });
    const handler = new CreditCardHandler({
      braintreeManager: braintreeManager,
      hostedFieldClient: client,
      hostedFieldConfig: mockHostedFieldConfig,
    });
    handler.removeFieldErrors([]);
    expect(mockHostedFieldContainer.removeErrorsCalled).to.be.true;
  });

  it('can show the error message', async () => {
    const braintreeManager = new MockBraintreeManager();
    const client = new MockHostedFieldsClient();
    const mockHostedFieldContainer = new MockHostedFieldContainer();
    const mockHostedFieldConfig: HostedFieldConfiguration = new HostedFieldConfiguration({
      hostedFieldStyle: mockHostedFieldStyle,
      hostedFieldFieldOptions: mockHostedFieldFieldOptions,
      hostedFieldContainer: mockHostedFieldContainer,
    });
    const handler = new CreditCardHandler({
      braintreeManager: braintreeManager,
      hostedFieldClient: client,
      hostedFieldConfig: mockHostedFieldConfig,
    });
    handler.showErrorMessage();
    expect(mockHostedFieldContainer.showErrorMessageCalled).to.be.true;
  });

  it('can hide the error message', async () => {
    const braintreeManager = new MockBraintreeManager();
    const client = new MockHostedFieldsClient();
    const mockHostedFieldContainer = new MockHostedFieldContainer();
    const mockHostedFieldConfig: HostedFieldConfiguration = new HostedFieldConfiguration({
      hostedFieldStyle: mockHostedFieldStyle,
      hostedFieldFieldOptions: mockHostedFieldFieldOptions,
      hostedFieldContainer: mockHostedFieldContainer,
    });
    const handler = new CreditCardHandler({
      braintreeManager: braintreeManager,
      hostedFieldClient: client,
      hostedFieldConfig: mockHostedFieldConfig,
    });
    handler.hideErrorMessage();
    expect(mockHostedFieldContainer.hideErrorMessageCalled).to.be.true;
  });

  it('retries the expected number of times before failure', async () => {
    const braintreeManager = new MockBraintreeManager();
    const client = new MockHostedFieldsClient();

    let retryCount = 0;
    Sinon.stub(client, 'create').callsFake(() => {
      retryCount++;
      throw new Error('Error');
    });

    const mockHostedFieldContainer = new MockHostedFieldContainer();
    const hostedFieldsSpy = Sinon.spy(mockHostedFieldContainer, 'resetHostedFields');

    const mockHostedFieldConfig: HostedFieldConfiguration = new HostedFieldConfiguration({
      hostedFieldStyle: mockHostedFieldStyle,
      hostedFieldFieldOptions: mockHostedFieldFieldOptions,
      hostedFieldContainer: mockHostedFieldContainer,
    });
    const handler = new CreditCardHandler({
      braintreeManager: braintreeManager,
      hostedFieldClient: client,
      hostedFieldConfig: mockHostedFieldConfig,
      retryInverval: 0.01,
      maxRetryCount: 3,
      loadTimeout: 0.01,
    });

    try {
      await handler.instance.get();
      expect.fail('Should have thrown an error');
    } catch (e) {}

    // initial call + 3 retries
    expect(retryCount).to.equal(4);
    expect(hostedFieldsSpy.callCount).to.equal(4);
  });

  it('retries creating the hosted fields if they fail', async () => {
    const braintreeManager = new MockBraintreeManager();
    const client = new MockHostedFieldsClient();

    let retryCount = 0;
    Sinon.stub(client, 'create').callsFake(() => {
      if (retryCount < 2) {
        retryCount++;
        throw new Error('Error');
      }
      return Promise.resolve(client);
    });

    const mockHostedFieldContainer = new MockHostedFieldContainer();
    const mockHostedFieldConfig: HostedFieldConfiguration = new HostedFieldConfiguration({
      hostedFieldStyle: mockHostedFieldStyle,
      hostedFieldFieldOptions: mockHostedFieldFieldOptions,
      hostedFieldContainer: mockHostedFieldContainer,
    });
    const handler = new CreditCardHandler({
      braintreeManager: braintreeManager,
      hostedFieldClient: client,
      hostedFieldConfig: mockHostedFieldConfig,
      retryInverval: 0.01,
      maxRetryCount: 3,
      loadTimeout: 0.01,
    });

    const instance = await handler.instance.get();
    expect(instance).to.not.be.null;
    expect(retryCount).to.equal(2);
  });

  it('emits an event when retrying or failing', async () => {
    const braintreeManager = new MockBraintreeManager();
    const client = new MockHostedFieldsClient();

    Sinon.stub(client, 'create').callsFake(() => {
      throw new Error('Error');
    });

    const mockHostedFieldContainer = new MockHostedFieldContainer();
    const mockHostedFieldConfig: HostedFieldConfiguration = new HostedFieldConfiguration({
      hostedFieldStyle: mockHostedFieldStyle,
      hostedFieldFieldOptions: mockHostedFieldFieldOptions,
      hostedFieldContainer: mockHostedFieldContainer,
    });
    const handler = new CreditCardHandler({
      braintreeManager: braintreeManager,
      hostedFieldClient: client,
      hostedFieldConfig: mockHostedFieldConfig,
      retryInverval: 0.01,
      maxRetryCount: 3,
      loadTimeout: 0.01,
    });

    let retryCountEvent = 0;
    let retryFailedEvent = 0;
    handler.on('hostedFieldsRetry', () => {
      retryCountEvent++;
    });
    handler.on('hostedFieldsFailed', () => {
      retryFailedEvent++;
    });

    try {
      await handler.instance.get();
    } catch (e) {}

    expect(retryCountEvent).to.equal(3);
    expect(retryFailedEvent).to.equal(1);
  });
});
