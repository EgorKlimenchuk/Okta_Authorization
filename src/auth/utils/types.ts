export type UserType = {
  email?: string;
  name?: string;
};

export enum AuthProviderType {
  OKTA = 'okta',
  NONE = 'none',
}

export type AccessTokenType = { accessToken: string; expiresAt?: number };

export type ServiceType = {
  type: AuthProviderType;
  checkIsAuthenticated: () => Promise<boolean>;
  getAccessToken: () => Promise<AccessTokenType>;
  renewToken: () => Promise<AccessTokenType>;
  signInWithRedirect: () => Promise<void>;
  signOut: () => Promise<void>;
  handleLoginRedirect: () => Promise<AccessTokenType>;
  getUserInfo: () => Promise<UserType>;
};

export type CreateServiceType =
  | { service: ServiceType; error?: never }
  | { error: string; service?: never };
