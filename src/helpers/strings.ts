import { v5 as uuidv5 } from 'uuid';

const namespace = 'c56a4180-65aa-42ec-a945-5fd21dec0501'; // a fixed namespace value

export const normalize = (str: string): string =>
  str
    ?.trim()
    .toLowerCase()
    .replaceAll('á', 'a')
    .replaceAll('é', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ó', 'o')
    .replaceAll('ú', 'u')
    .replaceAll('ñ', 'n');

export const generateUUID = (storeId: number, date: Date) =>
  uuidv5(`${storeId}-${date.toISOString()}`, namespace);
