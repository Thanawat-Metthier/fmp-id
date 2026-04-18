import { DataWithPagination } from '@/utils/http-response';

/**
 * Converts items and pagination metadata into a standardized DataWithPagination format.
 * @param items The array of data for the current page
 * @param total The total number of items matching the query in the database
 * @param page The current page number
 * @param limit The number of items per page
 * @returns A formatted DataWithPagination object
 */
export function toDataWithPagination<T>(
  items: T[],
  total: number,
  page: number | string,
  limit: number | string,
): DataWithPagination<T> {
  const pageNum = Number(page);
  const limitNum = Number(limit);
  return {
    items,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: items.length,
    },
  };
}
