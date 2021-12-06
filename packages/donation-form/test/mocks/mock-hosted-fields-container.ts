/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HostedFieldContainerInterface,
  HostedFieldName,
} from '../../src/braintree-manager/payment-providers/credit-card/hosted-field-container';

export class MockHostedFieldContainer implements HostedFieldContainerInterface {
  markErrorsCalled = false;
  removeErrorsCalled = false;
  showErrorMessageCalled = false;
  hideErrorMessageCalled = false;

  resetIframes(): void {
    // noop
  }

  fieldFor(field: HostedFieldName): HTMLInputElement {
    const input = document.createElement('input') as HTMLInputElement;
    return input;
  }

  markFieldErrors(fields: HostedFieldName[]): void {
    this.markErrorsCalled = true;
  }

  removeFieldErrors(fields: HostedFieldName[]): void {
    this.removeErrorsCalled = true;
  }

  showErrorMessage(message?: string | undefined): void {
    this.showErrorMessageCalled = true;
  }

  hideErrorMessage(): void {
    this.hideErrorMessageCalled = true;
  }
}
