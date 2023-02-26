import { AccessTokenType, AuthProviderType, UserType } from 'auth/utils/types';
import { LoadingStatusesEnum } from 'api/utils/types';

export type AuthStateType = {
  providerType?: AuthProviderType;
  user?: UserType;
  accessToken?: string;
  expiresAt?: number;
  status: LoadingStatusesEnum;
  error: string;
};

export type SignInPayloadType = {
  isAuthenticated: boolean;
  accessToken?: string;
  expiresAt?: number;
  user?: UserType;
};

export type HandleLoginRedirectPayloadType = {
  user: UserType;
} & AccessTokenType;
