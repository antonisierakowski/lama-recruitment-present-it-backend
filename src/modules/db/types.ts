export enum Table {
  Presentation = 'public.presentation',
}

export enum PostgresErrorCode {
  CHECK_VIOLATION = '23514',
  INVALID_REPRESENTATION = '22P02',
}

export interface PostgresError {
  code: PostgresErrorCode;
}
