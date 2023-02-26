import {
  AccessTokenType,
  AuthProviderType,
  ServiceType,
  UserType,
} from 'auth/utils/types';

export const createNoneService = (): ServiceType => {
  const getAccessToken = (): Promise<AccessTokenType> =>
    Promise.resolve({ accessToken: '' });

  const getUserInfo = (): Promise<UserType> =>
    Promise.resolve({
      name: undefined,
      email: undefined,
    });

  const signInWithRedirect = (): Promise<void> => Promise.resolve();

  const signOut = (): Promise<void> => Promise.resolve();

  const checkIsAuthenticated = (): Promise<boolean> => Promise.resolve(true);

  const handleLoginRedirect = (): Promise<AccessTokenType> =>
    Promise.resolve({
      accessToken: '',
    });

  const renewToken = (): Promise<AccessTokenType> =>
    Promise.resolve({
      accessToken: '',
    });

  return {
    type: AuthProviderType.NONE,
    renewToken,
    getAccessToken,
    getUserInfo,
    signInWithRedirect,
    signOut,
    checkIsAuthenticated,
    handleLoginRedirect,
  };
};
