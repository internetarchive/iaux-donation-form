import { BadgedInput } from '../../../form-elements/badged-input';

export enum HostedFieldName {
  Number = 'number',
  CVV = 'cvv',
  ExpirationDate = 'expirationDate',
}

export interface HostedFieldContainerInterface {
  fieldFor(field: HostedFieldName): HTMLInputElement;
  markFieldErrors(fields: HostedFieldName[]): void;
  removeFieldErrors(fields: HostedFieldName[]): void;
  showErrorMessage(message?: string): void;
  hideErrorMessage(): void;
}

export class HostedFieldContainer implements HostedFieldContainerInterface {
  private number: HTMLInputElement;

  private cvv: HTMLInputElement;

  private expirationDate: HTMLInputElement;

  private errorContainer: HTMLDivElement;

  fieldFor(field: HostedFieldName): HTMLInputElement {
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
    const error = message ?? 'Some payment information below is missing or incorrect.'
    this.errorContainer.innerHTML = error;
    this.errorContainer.style.display = 'block';
  }

  hideErrorMessage(): void {
    this.errorContainer.style.display = 'none';
  }

  constructor(options: {
    number: HTMLInputElement;
    cvv: HTMLInputElement;
    expirationDate: HTMLInputElement;
    errorContainer: HTMLDivElement;
  }) {
    this.number = options.number;
    this.cvv = options.cvv;
    this.expirationDate = options.expirationDate;
    this.errorContainer = options.errorContainer;
  }
}
