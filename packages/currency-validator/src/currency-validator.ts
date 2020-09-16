export interface FieldValidatorInterface {
  keydown(e: KeyboardEvent): void;
}

export class CurrencyValidator implements FieldValidatorInterface {
  keydown(e: KeyboardEvent): void {
    const char = e.key;

    // if user is holding down command/ctrl for like select all, allow it
    if (e.metaKey) {
      return;
    }

    switch (char) {
      case 'Tab':
      case 'Delete':
      case 'Backspace':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        return;
    }

    const input = e.target as HTMLInputElement;
    const value = input.value;
    const prefix = value.slice(0, input.selectionStart ?? 0);
    const suffix = value.slice(input.selectionEnd ?? 0);
    const newValue = `${prefix}${char}${suffix}`;
    const regex = /^[0-9]+(\.[0-9]{0,2})?$/g; // currency regex xxxxx.xx
    const valid = newValue.match(regex);

    if (!valid) {
      e.preventDefault();
    }
  }
}
