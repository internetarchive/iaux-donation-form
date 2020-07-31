import {
  HostedFieldContainerInterface,
  HostedFieldName,
} from '../../src/braintree-manager/payment-providers/credit-card/hosted-field-container';

export class MockHostedFieldContainer implements HostedFieldContainerInterface {
  markErrorsCalled = false;
  removeErrorsCalled = false;
  showErrorMessageCalled = false;
  hideErrorMessageCalled = false;

  fieldFor(field: HostedFieldName): HTMLInputElement {
    throw new Error('Method not implemented.');
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
