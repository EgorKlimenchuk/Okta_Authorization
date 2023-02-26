export const generateAuthorizationHeader = (
  accessToken?: string,
  tokenType = 'Bearer'
) => {
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers.Authorization = `${tokenType} ${accessToken}`;
  }

  return headers;
};

export const getTimestampInSeconds = (): number =>
  Math.floor(Date.now() / 1000);
