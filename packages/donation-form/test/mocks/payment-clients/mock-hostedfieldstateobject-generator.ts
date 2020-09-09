export function getMockStateObject(valid: boolean): braintree.HostedFieldsStateObject {
  return {
    cards: [],
    emittedBy: 'number',
    fields: {
      number: {
        container: document.createElement('div'),
        isFocused: false,
        isEmpty: false,
        isPotentiallyValid: valid,
        isValid: valid,
      },
      cvv: {
        container: document.createElement('div'),
        isFocused: false,
        isEmpty: false,
        isPotentiallyValid: valid,
        isValid: valid,
      },
      expirationDate: {
        container: document.createElement('div'),
        isFocused: false,
        isEmpty: false,
        isPotentiallyValid: valid,
        isValid: valid,
      },
      expirationMonth: {
        container: document.createElement('div'),
        isFocused: false,
        isEmpty: false,
        isPotentiallyValid: valid,
        isValid: valid,
      },
      expirationYear: {
        container: document.createElement('div'),
        isFocused: false,
        isEmpty: false,
        isPotentiallyValid: valid,
        isValid: valid,
      },
      postalCode: {
        container: document.createElement('div'),
        isFocused: false,
        isEmpty: false,
        isPotentiallyValid: valid,
        isValid: valid,
      },
    },
  };
}
