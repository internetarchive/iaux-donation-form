import { expect } from '@open-wc/testing';
import { parseAmount } from '../../../src/util/parse-amount';

describe('parseAmount', () => {
  const cases: [string, number][] = [
    ['5', 5],
    ['10.5', 10.5],
    ['10.50', 10.5],
    ['10,50', 10.5],
    ['10,', 10],
    ['1,000', 1000],
    ['1,000,000', 1000000],
    ['1.234,50', 1234.5],
    ['1,234.50', 1234.5],
    ['9999,99', 9999.99],
  ];
  cases.forEach(([typed, expected]) => {
    it(`${typed} is ${expected}`, () => {
      expect(parseAmount(typed)).to.equal(expected);
    });
  });

  ['', 'abc', '12abc', '-5', '1e3', '10.5055', '1,00,0', '1.000.50', ',5'].forEach(typed => {
    it(`${typed} is not an amount`, () => {
      expect(parseAmount(typed)).to.be.NaN;
    });
  });
});
