import fs from 'fs';

export const fileExists = (filepath: string): Promise<boolean> => {
  try {
    if (fs.existsSync(filepath)) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  } catch (err) {
    return Promise.resolve(false);
  }
};
