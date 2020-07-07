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
      input.parentElement?.classList.add('error');
    });
  }

  removeFieldErrors(fields: HostedFieldName[]): void {
    fields.forEach(field => {
      const input = this.fieldFor(field);
      input.parentElement?.classList.remove('error');
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
