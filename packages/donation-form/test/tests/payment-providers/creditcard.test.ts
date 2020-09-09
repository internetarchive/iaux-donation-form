import { expect } from '@open-wc/testing';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { MockHostedFieldsClient } from '../../mocks/payment-clients/mock-hostedfields-client';
import { mockHostedFieldTokenizePayload } from '../../mocks/payment-clients/mock-hostedfieldtokenizepayload';
import { CreditCardHandler } from '../../../src/braintree-manager/payment-providers/credit-card/credit-card';
import { MockHostedFieldContainer } from '../../mocks/mock-hosted-fields-container';
import { HostedFieldConfiguration } from '../../../src/braintree-manager/payment-providers/credit-card/hosted-field-configuration';
import {
  mockHostedFieldStyle,
  mockHostedFieldFieldOptions,
  mockHostedFieldConfig,
} from '../../mocks/mock-hosted-fields-config';

describe('CreditCardHandler', () => {
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
});
