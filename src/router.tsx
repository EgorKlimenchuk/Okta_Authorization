import { Suspense } from 'react';

import { createBrowserRouter } from 'react-router-dom';

import { App } from 'app';
import { AuthError, LoginCallback, SecureRoute } from 'auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SecureRoute>
        <Suspense fallback="Loading...">
          <App />
        </Suspense>
      </SecureRoute>
    ),
  },
  {
    path: '/login/error',
    element: (
      <Suspense fallback="Loading...">
        <AuthError />
      </Suspense>
    ),
  },
  {
    path: '/login/callback',
    element: <LoginCallback />,
  },
]);
