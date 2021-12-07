import { BadgedInput } from '../../../form-elements/badged-input';

export enum HostedFieldName {
  Number = 'number',
  CVV = 'cvv',
  ExpirationDate = 'expirationDate',
}

export interface HostedFieldContainerInterface {
  fieldFor(field: HostedFieldName): HTMLDivElement;
  markFieldErrors(fields: HostedFieldName[]): void;
  removeFieldErrors(fields: HostedFieldName[]): void;
  showErrorMessage(message?: string): void;
  hideErrorMessage(): void;
  /**
   * Determine if the hosted fields have loaded.
   *
   * This is used to detect timeouts on the credit card hosted fields.
   */
  allHostedFieldsAreLoaded(): boolean;
  /**
   * Reset the hosted fields to retry in case of timeout
   */
  resetHostedFields(): void;
}

export class HostedFieldContainer implements HostedFieldContainerInterface {
  private number: HTMLDivElement;

  private cvv: HTMLDivElement;

  private expirationDate: HTMLDivElement;

  private errorContainer: HTMLDivElement;

  fieldFor(field: HostedFieldName): HTMLDivElement {
    switch (field) {
      case HostedFieldName.Number:
        return this.number;
      case HostedFieldName.CVV:
        return this.cvv;
      case HostedFieldName.ExpirationDate:
        return this.expirationDate;
    }
  }

  markFieldErrors(fields: HostedFieldName[]): void {
    fields.forEach(field => {
      const input = this.fieldFor(field);
      (input.parentElement as BadgedInput).error = true;
    });
  }

  removeFieldErrors(fields: HostedFieldName[]): void {
    fields.forEach(field => {
      const input = this.fieldFor(field);
      (input.parentElement as BadgedInput).error = false;
    });
  }

  showErrorMessage(message?: string): void {
    const error = message ?? 'Some payment information below is missing or incorrect.';
    this.errorContainer.innerHTML = error;
    this.errorContainer.style.display = 'block';
  }

  hideErrorMessage(): void {
    this.errorContainer.style.display = 'none';
  }

  /** @inheritdoc */
  allHostedFieldsAreLoaded(): boolean {
    const elements = [this.number, this.cvv, this.expirationDate];
    return elements.every(element => {
      return element.firstChild !== null;
    });
  }

  resetHostedFields(): void {
    const elements = [this.number, this.cvv, this.expirationDate];
    elements.forEach(element => {
      while (element.firstChild) {
        element.firstChild.remove();
      }
    });
  }

  constructor(options: {
    number: HTMLDivElement;
    cvv: HTMLDivElement;
    expirationDate: HTMLDivElement;
    errorContainer: HTMLDivElement;
  }) {
    this.number = options.number;
    this.cvv = options.cvv;
    this.expirationDate = options.expirationDate;
    this.errorContainer = options.errorContainer;
  }
}
