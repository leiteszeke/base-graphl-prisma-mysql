export const generatePagination = (
  page?: number | null,
  limit?: number | null
) => {
  const currentPage = page ?? 1;
  const take = limit ?? 20;
  const skip = (currentPage - 1) * take;

  const skipPagination = limit === 0;

  return {
    currentPage,
    take: skipPagination ? undefined : take,
    skip: skipPagination ? undefined : skip,
  };
};

export const generateMeta = (
  page: number,
  perPage: number | undefined,
  total: number
) => {
  const perPageCount = typeof perPage === 'undefined' ? total : perPage;

  return {
    firstPage: 1,
    lastPage: total === 0 ? 1 : Math.ceil(total / perPageCount),
    total,
    page,
    perPage: perPage ?? total,
  };
};

export const emptyResponse = (take?: number) => ({
  data: [],
  meta: generateMeta(1, take, 0),
});
