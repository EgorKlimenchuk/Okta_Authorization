import OktaAuth, { AccessToken, IDToken, UserClaims } from '@okta/okta-auth-js';

import {
  AccessTokenType,
  AuthProviderType,
  ServiceType,
  UserType,
} from 'auth/utils/types';

const isValidIssuer = (url: string) =>
  /http(s)?:\/\/.*\.okta\.com\/?.*/.test(url);

export const createOktaService = (
  issuer: string,
  clientId: string
): ServiceType => {
  if (!isValidIssuer(issuer)) throw new Error('Not valid issuer');

  const client = new OktaAuth({
    issuer,
    clientId,
    redirectUri: `${window.location.origin}/login/callback`,
  });
  const { tokenManager } = client;

  const renewToken = async (): Promise<AccessTokenType> => {
    const [tokenInfo] = (await Promise.all([
      tokenManager.renew('accessToken'),
      tokenManager.renew('idToken'),
    ])) as [AccessToken, IDToken];

    return {
      accessToken: tokenInfo.accessToken,
      expiresAt: tokenInfo.expiresAt,
    };
  };

  const getAccessToken = async (): Promise<AccessTokenType> => {
    const tokenInfo = (await tokenManager.get('accessToken')) as AccessToken;

    return {
      accessToken: tokenInfo.accessToken,
      expiresAt: tokenInfo.expiresAt,
    };
  };

  const getUserInfo = async (): Promise<UserType> => {
    const tokens = (await tokenManager.get('accessToken')) as AccessToken;
    const idToken = (await client.tokenManager.get('idToken')) as IDToken;
    const userInfo: UserClaims = await client.token.getUserInfo(
      tokens,
      idToken
    );

    return {
      email: userInfo.email,
      name: userInfo.name,
    };
  };

  const signInWithRedirect = async (): Promise<void> =>
    client.signInWithRedirect();

  const signOut = async (): Promise<void> =>
    client.signOut({ clearTokensBeforeRedirect: true });

  const checkIsAuthenticated = async (): Promise<boolean> =>
    client.isAuthenticated();

  const handleLoginRedirect = async (): Promise<AccessTokenType> => {
    const { tokens } = await client.token.parseFromUrl();
    client.tokenManager.setTokens(tokens);

    return {
      accessToken: tokens.accessToken!.accessToken,
      expiresAt: tokens.accessToken!.expiresAt,
    };
  };

  return {
    type: AuthProviderType.OKTA,
    renewToken,
    getAccessToken,
    getUserInfo,
    signInWithRedirect,
    signOut,
    checkIsAuthenticated,
    handleLoginRedirect,
  };
};
