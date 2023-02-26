import { generateAuthorizationHeader } from 'auth';
import { RootState } from 'store';

export const generateHeadersByState = (
  state: unknown,
  inintialHeaders: Record<string, string> = {}
): Record<string, string> => {
  const { accessToken } = (state as RootState).AuthSliceReducer;
  const authHeaders = generateAuthorizationHeader(accessToken);

  return {
    ...inintialHeaders,
    ...authHeaders,
  };
};
