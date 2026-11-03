/**
 * Reads a typed, pasted or linked amount as a number, whatever the language.
 * A separator (comma or dot) followed by one or two digits at the end is the
 * decimal point, and one followed by exactly three digits is a thousands
 * separator: `10,50` and `10.50` are 10.50, `1,000` and `1.000` are 1000, and
 * `1.000,50` and `1,000.50` are 1000.50. A trailing separator, as in `10,`,
 * is a decimal point still being typed. Returns `NaN` for anything else, so a
 * value that can't be read is reported instead of guessed at.
 */
export function parseAmount(value: string): number {
  const text = value.trim();
  if (!/^[0-9]+([.,][0-9]*)*$/.test(text)) return NaN;

  const lastSeparator = Math.max(text.lastIndexOf(','), text.lastIndexOf('.'));
  if (lastSeparator === -1) return parseFloat(text);

  const separator = text[lastSeparator];
  const other = separator === ',' ? '.' : ',';
  const digitsAfter = text.length - lastSeparator - 1;
  const grouped = (whole: string, groupSeparator: string): boolean =>
    new RegExp(`^[0-9]{1,3}(\\${groupSeparator}[0-9]{3})*$`).test(whole);

  if (digitsAfter <= 2) {
    const whole = text.slice(0, lastSeparator);
    const wholeOk = whole.includes(other) ? grouped(whole, other) : /^[0-9]+$/.test(whole);
    if (!wholeOk) return NaN;
    const fraction = text.slice(lastSeparator + 1);
    return parseFloat(`${whole.split(other).join('')}.${fraction || '0'}`);
  }

  if (digitsAfter === 3 && grouped(text, separator)) {
    return parseFloat(text.split(separator).join(''));
  }
  return NaN;
}
