import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingStatusesEnum } from 'api/utils/types';
import { AuthProviderType } from 'auth/utils/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { signIn } from 'auth/store/AuthSlice';

type SecureRouteProps = {
  children: JSX.Element;
};

export const SecureRoute = ({ children }: SecureRouteProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accessToken, providerType, status, error } = useAppSelector(
    (state) => state.AuthSliceReducer
  );

  const isAuthenticated =
    providerType === AuthProviderType.NONE ? true : Boolean(accessToken);

  const isLoading = useMemo(
    () => status === LoadingStatusesEnum.LOADING,
    [status]
  );

  useEffect(() => {
    error && navigate('/login/error');
  }, [error, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(signIn());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated || isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};
