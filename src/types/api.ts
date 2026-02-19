export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_entries: number;
  per_page: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
