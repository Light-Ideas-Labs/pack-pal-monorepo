import type { FilterQuery, Model, SortOrder } from "mongoose";

export type PageQuery = { page?: unknown; limit?: unknown };
export type PageParams = { page: number; limit: number };

export type PageMeta = {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type PaginatedResult<T> = {
  data: T[];
  _links: null | { self: string; next?: string; prev?: string };
  _meta: PageMeta;
};

/** Safely parse & clamp pagination params from a request query */
export function parsePageParams(q: PageQuery, defaults: PageParams = { page: 1, limit: 10 }): PageParams {
  const page = Math.max(1, Number(q.page ?? defaults.page) || defaults.page);
  const limit = Math.min(100, Math.max(1, Number(q.limit ?? defaults.limit) || defaults.limit));
  return { page, limit };
}

/** Build the standard meta block */
export function buildMeta(total: number, page: number, limit: number): PageMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;
  return {
    total,
    totalPages,
    currentPage: page,
    perPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
}

/** Convert to final paginated envelope (array source) */
export function paginateArray<T>(data: readonly T[], page = 1, limit = 10): PaginatedResult<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const items = data.slice(startIndex, endIndex);
  const meta = buildMeta(data.length, page, limit);
  return { data: items, _links: null, _meta: meta };
}

/** Convert raw items + total to final envelope */
export function toPaginated<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T> {
  return { data: items, _links: null, _meta: buildMeta(total, page, limit) };
}

/** Mongo helper: text/keyword filter */
export function textFilter(q?: string): FilterQuery<any> {
  if (!q) return {};
  return { $text: { $search: q } };
}

/** Paginate a Mongoose Model with filter/sort */
export async function paginateMongoose<T extends object>(
  Model: Model<T>,
  filter: FilterQuery<T>,
  opts: { page: number; limit: number; sort?: Record<string, SortOrder> }
): Promise<PaginatedResult<T>> {
  const { page, limit, sort = { updatedAt: -1 } } = opts;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Model.countDocuments(filter),
  ]);

  return toPaginated(items as T[], total, page, limit);
}
