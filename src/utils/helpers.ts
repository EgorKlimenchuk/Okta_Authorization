export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const isNullable = <T>(
  value: T | null | undefined
): value is null | undefined => value === null || value === undefined;

export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value);

export const isObject = <T extends object>(value: unknown): value is T =>
  typeof value === 'object' && !isArray(value) && value !== null;

export const isEmpty = <T>(value: T) =>
  isObject(value) && Object.keys(value).length === 0;

export const isNumber = (value: unknown): value is number =>
  isDefined(value) && typeof value === 'number';

export const isString = (value: unknown): value is string =>
  isDefined(value) && typeof value === 'string';

export const toString = (input: unknown): string => {
  if (isNullable(input)) return '';
  if (isObject(input)) return input.toString();

  switch (typeof input) {
    case 'bigint':
    case 'number':
    case 'boolean':
    case 'symbol':
      return input.toString();
    case 'string':
      return input;
    default:
      return '';
  }
};

export const getTimestampInSeconds = (): number =>
  Math.floor(Date.now() / 1000);
