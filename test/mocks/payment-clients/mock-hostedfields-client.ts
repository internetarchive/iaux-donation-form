/* eslint-disable @typescript-eslint/no-explicit-any */

import { mockHostedFieldTokenizePayload } from './mock-hostedfieldtokenizepayload';
import { getMockStateObject } from './mock-hostedfieldstateobject-generator';

export interface MockHostedFieldsClientEvents {
  validityChanged: (event: braintree.HostedFieldsStateObject) => void;
  focus: (event: braintree.HostedFieldsStateObject) => void;
  blur: (event: braintree.HostedFieldsStateObject) => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockHostedFieldsClient implements braintree.HostedFields {
  emitValidityChangedEvent(valid: boolean): void {
    const handler = this.changeHandlers['validityChange'];
    if (!handler) {
      return;
    }
    const stateObject = getMockStateObject(valid);
    handler(stateObject);
  }

  async create(options: {
    client?: braintree.Client | undefined;
    authorization?: string | undefined;
    fields: braintree.HostedFieldFieldOptions;
    styles?: any;
  }): Promise<braintree.HostedFields> {
    return this;
  }

  styleOptions: any;

  VERSION = 'foo';

  private changeHandlers: {
    [key: string]: (event: braintree.HostedFieldsStateObject) => void;
  } = {};

  on(
    event: braintree.HostedFieldEventType,
    handler: (event: braintree.HostedFieldsStateObject) => void,
  ): void {
    this.changeHandlers[event] = handler.bind(this);
  }

  async teardown(): Promise<void> {
    return;
  }

  async tokenize(options?: {
    vault?: boolean;
    cardholderName?: string;
    billingAddress?: any;
  }): Promise<braintree.HostedFieldsTokenizePayload> {
    return this.mockPayload;
  }

  addClass(field: string, classname: string, callback?: braintree.callback | undefined): void {
    throw new Error('Method not implemented.');
  }

  removeClass(field: string, classname: string, callback?: braintree.callback | undefined): void {
    throw new Error('Method not implemented.');
  }

  setPlaceholder(
    field: string,
    placeholder: string,
    callback?: braintree.callback | undefined,
  ): void {
    throw new Error('Method not implemented.');
  }

  clear(field: string, callback?: braintree.callback | undefined): void {
    throw new Error('Method not implemented.');
  }

  getState(): any {
    throw new Error('Method not implemented.');
  }

  constructor(options?: { mockHostedFieldTokenizePayload: braintree.HostedFieldsTokenizePayload }) {
    this.mockPayload = options?.mockHostedFieldTokenizePayload ?? mockHostedFieldTokenizePayload;
  }

  private mockPayload: braintree.HostedFieldsTokenizePayload;
}
