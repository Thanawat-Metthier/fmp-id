import { Static, t, TSchema } from 'elysia';

export class HttpResponse<T> {
  public success: boolean;
  public message: string;
  public data: T | null;
  public error: unknown | null;
  public timestamp: string;
  public statusCode: number;

  constructor(
    data: T | null = null,
    statusCode: number = 200,
    message: string = 'success',
    success: boolean = true,
    error: unknown | null = null,
  ) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
    this.success = success;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static success<T>(data: T, statusOrMessage: number | string = 200, message: string = 'success'): any {
    let statusCode = 200;
    let msg = message;

    if (typeof statusOrMessage === 'number') {
      statusCode = statusOrMessage;
    } else {
      msg = statusOrMessage;
    }

    return new HttpResponse(data, statusCode, msg, true, null);
  }

  static error(message: string = 'error', error: unknown = null, statusCode: number = 500): HttpResponse<null> {
    return new HttpResponse(null, statusCode, message, false, error);
  }

  toJSON(): any {
    return JSON.parse(
      JSON.stringify({
        success: this.success,
        message: this.message,
        data: this.data as T,
        error: this.error,
        timestamp: this.timestamp,
      }),
    );
  }

  static schema<T extends TSchema>(data: T) {
    return t.Object({
      success: t.Boolean(),
      message: t.String(),
      data: t.Nullable(data),
      error: t.Nullable(t.Any()),
      timestamp: t.String(),
    });
  }
}

export const PaginationSchema = t.Object({
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
  totalPages: t.Number(),
  totalItems: t.Number(),
});

export const DataWithPaginationSchema = <T extends TSchema>(items: T) =>
  t.Object({
    items: t.Array(items),
    pagination: PaginationSchema,
  });

export type Pagination = Static<typeof PaginationSchema>;

export type DataWithPagination<T> = {
  items: T[];
  pagination: Pagination;
};

export const DataWithOutPaginationSchema = <T extends TSchema>(items: T) => t.Array(items);

export type DataWithOutPagination<T> = {
  items: T[];
}
