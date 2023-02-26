export enum LoadingStatusesEnum {
  INITIAL = 'INITIAL',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type RequestOptionsType = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
};
