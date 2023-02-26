import { isRejectedWithValue } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { signOut } from 'auth';
import { useAppDispatch, useAppSelector } from 'store/hooks';

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.AuthSliceReducer);

  const logout = useCallback(() => {
    dispatch(signOut()).then((action) => {
      action && isRejectedWithValue(action) && navigate('/login/error');
    });
  }, [dispatch, navigate]);

  return (
    <div className="">
      <div>{user?.name}</div>
      <div>{user?.email}</div>
      {user && <div onClick={logout}>sign out</div>}
    </div>
  );
};
