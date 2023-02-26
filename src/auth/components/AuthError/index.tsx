import { useSelector } from 'react-redux';

import { RootState } from 'store';

import './index.css';

export const AuthError = () => {
  const { error } = useSelector((state: RootState) => state.AuthSliceReducer);

  return (
    <div className="auth-error-wrapper">
      <div>Something went wrong, please contact the administrator</div>
      <div>{error}</div>
    </div>
  );
};
