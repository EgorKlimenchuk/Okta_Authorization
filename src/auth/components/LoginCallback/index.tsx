import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleLoginRedirect } from 'auth/store/AuthSlice';
import { AuthProviderType } from 'auth/utils/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';

export const LoginCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, accessToken, providerType } = useAppSelector(
    (state) => state.AuthSliceReducer
  );

  const isAuthenticated =
    providerType === AuthProviderType.NONE ? true : Boolean(accessToken);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      dispatch(handleLoginRedirect());
    }
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      navigate('/login/error');
    }
  }, [error, navigate]);

  return <div>Loading...</div>;
};
