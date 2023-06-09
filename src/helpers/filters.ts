import { TrashedFilter } from '../types';

// null = Default
// undefined = Default
// -1 = Everything
// 0 = Only no deleted
// 1 = Only deleted

export const generateTrashed = (trashed: TrashedFilter) => {
  // Default, avoid deleted items
  if (typeof trashed === 'undefined' || trashed === null) {
    return { deletedAt: null };
  }

  // Everything, no filter
  if (trashed === -1) {
    return {
      deletedAt: undefined,
    };
  }

  // Only no deleted items
  if (trashed === 0) {
    return {
      deletedAt: null,
    };
  }

  // Only deleted items
  if (trashed === 1) {
    return {
      deletedAt: {
        not: null,
      },
    };
  }

  // Default value
  return { deletedAt: null };
};
