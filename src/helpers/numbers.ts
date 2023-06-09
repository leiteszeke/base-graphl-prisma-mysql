import { RoundingConfig } from '../types';
import { chunkRight } from './arrays';

export const formatCurrency = (value: number) => {
  const [integer, decimal] = Number(value).toFixed(2).split('.');
  const chunks = chunkRight(integer, 3);
  const formatted = chunks
    .map((chunkItem) => {
      if (Array.isArray(chunkItem)) {
        return chunkItem.join('');
      }

      return chunkItem;
    })
    .join('.');

  return `$ ${formatted},${decimal}`;
};

export const getRoundingMethod = (config?: RoundingConfig) => {
  if (config?.rounding === 'CEIL') {
    return markNumberUp;
  }

  if (config?.rounding === 'FLOOR') {
    return markNumberDown;
  }

  if (config?.rounding === 'CUSTOM') {
    return markNumberCustom;
  }

  return Number;
};

export const calculatePrice = (
  cost: number,
  profit: number,
  tax?: number,
  config?: RoundingConfig
) => {
  const absCost = Math.abs(cost);
  const absProfit = Math.abs(profit);
  const profitAmount = absCost * (absProfit / 100);
  const price = absCost + profitAmount;
  const roundingMethod = getRoundingMethod(config);
  const defaultFloor = config?.roundingMethod?.floor ?? 4;

  if (!tax || tax === 0) {
    return roundingMethod(Number(price.toFixed(0)), defaultFloor);
  }

  const taxAmount = price * (tax / 100);

  return roundingMethod(Number((price + taxAmount).toFixed(0)), defaultFloor);
};

export const calculateProfit = (cost: number, price: number, tax?: number) => {
  const absCost = Math.abs(cost);
  const absPrice = Math.abs(price);
  const netPrice = tax ? absPrice / (1 + tax / 100) : absPrice;
  const percentageCost = (netPrice / absCost) * 100 - 100;

  return Number(percentageCost.toFixed(2));
};

export const validateTax = (tax?: number) => {
  const numberTax = Number(tax);

  if (!tax || isNaN(numberTax)) {
    return 0;
  }

  if (numberTax === 0 || numberTax === 10.5 || numberTax === 21) {
    return numberTax;
  }

  return 0;
};

export const calculatePercentage = (partial: number, total: number) => {
  if (partial === 0) {
    return 0;
  }

  if (total === Infinity) {
    return Math.floor(Math.random() * (25 - 4 + 1) + 4);
  }

  return Math.round((partial * 100) / total === 0 ? 1 : total);
};

export const rest = (...numbers: number[]) => {
  const [first, ...rest] = numbers;

  return rest.reduce((acc, val) => {
    const num1 = Number(acc.toFixed(2));
    const num2 = Number(val.toFixed(2));

    return num1 - num2;
  }, first);
};

export const getLastDigit = (num: number) => Number(num.toString().slice(-1));

export const markNumberDown = (num: number) => {
  if (num < 10) {
    return num;
  }

  return Math.floor(num / 10) * 10;
};

export const markNumberUp = (num: number) => Math.ceil(num / 10) * 10;

export const markNumberCustom = (num: number, floor: number) => {
  const lastDigit = getLastDigit(num);

  if (lastDigit === 0) {
    return num;
  }

  const methodToUse = lastDigit <= floor ? markNumberDown : markNumberUp;

  return methodToUse(num);
};
