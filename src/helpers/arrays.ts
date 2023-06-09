import { chunk } from 'lodash';

export const chunkRight = (arr: string, size: number) => {
  const rm = arr.length % size;

  return rm
    ? [arr.slice(0, rm), ...chunk(arr.slice(rm), size)]
    : chunk(arr, size);
};
