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
}

export class HostedFieldContainer implements HostedFieldContainerInterface {
  private number: HTMLInputElement;

  private cvv: HTMLInputElement;

  private expirationDate: HTMLInputElement;

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

  constructor(options: {
    number: HTMLInputElement;
    cvv: HTMLInputElement;
    expirationDate: HTMLInputElement;
  }) {
    this.number = options.number;
    this.cvv = options.cvv;
    this.expirationDate = options.expirationDate;
  }
}
