import { isObject, toString } from 'utils/helpers';

import { RequestOptionsType } from './utils/types';
import { defaultApiUrl } from './utils/constants';

const generateSearchParams = (
  paramsRecord: RequestOptionsType['params']
): URLSearchParams => {
  const params = new URLSearchParams();

  if (isObject(paramsRecord)) {
    Object.keys(paramsRecord).forEach((key: string) => {
      // TODO: Add support for array
      const value = toString(paramsRecord[key]);
      value && params.append(key, value);
    });
  }

  return params;
};

const getBaseUrl = () => {
  const { CL_API_PORT, CL_API_URL } = process.env;
  if (CL_API_URL) return CL_API_URL;
  const { protocol, hostname } = window.location;
  return CL_API_PORT
    ? `${protocol}//${hostname}:${CL_API_PORT}`
    : defaultApiUrl;
};

const generateUrl = (action: string, searchParams: URLSearchParams): string => {
  const baseUrl: string = getBaseUrl();
  const params = searchParams.toString();

  return `${baseUrl}${action}${params.length ? '?'.concat(params) : ''}`;
};

export const get = async <T>(action: string, options?: RequestOptionsType) => {
  const { params } = options || {};
  const url = generateUrl(action, generateSearchParams(params));
  const response = await fetch(url, {
    headers: options?.headers,
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return { data: (await response.json()) as T };
};

export const post = async <T>(
  action: string,
  body: BodyInit | null,
  options?: RequestOptionsType
) => {
  const { params } = options || {};
  const url = generateUrl(action, generateSearchParams(params));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body,
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return { data: (await response.json()) as T };
};

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};
