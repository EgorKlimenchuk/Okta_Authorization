import { LoadingStatusesEnum } from 'api/utils/types';
import { getTimestampInSeconds, renewToken } from 'auth';
import { AppStartListening } from 'store/listeners';

export const addAuthListeners = (startListening: AppStartListening) => {
  startListening({
    predicate: (action, currentState) => {
      const { status, expiresAt, accessToken } = currentState.AuthSliceReducer;
      return (
        Boolean(accessToken) &&
        Boolean(expiresAt) &&
        status !== LoadingStatusesEnum.LOADING &&
        status !== LoadingStatusesEnum.ERROR
      );
    },
    effect: (_, api) => {
      const { expiresAt } = api.getState().AuthSliceReducer;

      if (!expiresAt) return;

      const expireEarlySeconds = 30;
      if (expiresAt - getTimestampInSeconds() < expireEarlySeconds) {
        api.dispatch(renewToken());
      }
    },
  });
};
