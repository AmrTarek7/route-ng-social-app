export interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
}

export interface MetaRes {
  meta: {
    pagination: Pagination;
  };
}
