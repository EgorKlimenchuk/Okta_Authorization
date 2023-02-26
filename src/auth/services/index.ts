import { AuthProviderType, CreateServiceType } from 'auth/utils/types';
import { getErrorMessage } from 'api';

import { createOktaService } from './OktaService';
import { createNoneService } from './NoneService';

export const createService = (): CreateServiceType => {
  try {
    const authProvider =
      process.env.REACT_APP_AUTH_PROVIDER?.toLowerCase().trim();

    if (authProvider === AuthProviderType.OKTA.toLocaleLowerCase()) {
      return {
        service: createOktaService(
          process.env.REACT_APP_OKTA_ISSUER!,
          process.env.REACT_APP_OKTA_ISSUER!
        ),
      };
    }
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  return { service: createNoneService() };
};
