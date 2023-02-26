import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from '@reduxjs/toolkit';

import { createService } from 'auth/services';
import { LoadingStatusesEnum } from 'api/utils/types';
import { RootState } from 'store';
import { getErrorMessage } from 'api';

import {
  AuthStateType,
  HandleLoginRedirectPayloadType,
  SignInPayloadType,
} from './types';

const { service, error: serviceError } = createService();

const initialState: AuthStateType = {
  providerType: service?.type,
  status: LoadingStatusesEnum.INITIAL,
  error: serviceError || '',
};

export const renewToken = createAsyncThunk<
  HandleLoginRedirectPayloadType,
  undefined,
  { rejectValue: string }
>(
  'renewToken',
  async (_, { rejectWithValue }) => {
    try {
      const tokenInfo = await service!.renewToken();
      const user = await service!.getUserInfo();

      return {
        accessToken: tokenInfo?.accessToken,
        expiresAt: tokenInfo?.expiresAt,
        user,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition(): boolean {
      return !serviceError;
    },
  }
);

export const signIn = createAsyncThunk<
  SignInPayloadType,
  undefined,
  { rejectValue: string }
>(
  'signIn',
  async (_, { rejectWithValue }) => {
    try {
      const isAuthenticated = await service!.checkIsAuthenticated();

      if (isAuthenticated) {
        const [tokenInfo, user] = await Promise.all([
          service!.getAccessToken(),
          service!.getUserInfo(),
        ]);

        return {
          isAuthenticated: true,
          expiresAt: tokenInfo.expiresAt,
          accessToken: tokenInfo.accessToken,
          user,
        };
      }
      await service!.signInWithRedirect();
      return { isAuthenticated: false };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition(_, api) {
      if (serviceError) return false;

      const state = api.getState() as RootState;
      const { status } = state.AuthSliceReducer;
      return status !== LoadingStatusesEnum.LOADING;
    },
  }
);

export const signOut = createAsyncThunk<
  unknown,
  undefined,
  { rejectValue: string }
>(
  'signOut',
  async (_, { rejectWithValue }) => {
    try {
      return service!.signOut();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition(): boolean {
      return !serviceError;
    },
  }
);

export const handleLoginRedirect = createAsyncThunk<
  HandleLoginRedirectPayloadType,
  undefined,
  { rejectValue: string }
>(
  'handleLoginRedirect',
  async (_, { rejectWithValue }) => {
    try {
      const tokenInfo = await service!.handleLoginRedirect();
      const user = await service!.getUserInfo();

      return {
        accessToken: tokenInfo.accessToken,
        expiresAt: tokenInfo.expiresAt,
        user,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition(): boolean {
      return !serviceError;
    },
  }
);

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        signIn.fulfilled,
        (state: AuthStateType, action: PayloadAction<SignInPayloadType>) => {
          state.status = LoadingStatusesEnum.SUCCESS;
          const { isAuthenticated, accessToken, user, expiresAt } =
            action.payload;
          if (isAuthenticated) {
            state.accessToken = accessToken;
            state.user = user;
            state.expiresAt = expiresAt;
          }
        }
      )
      .addCase(
        handleLoginRedirect.fulfilled,
        (
          state: AuthStateType,
          action: PayloadAction<HandleLoginRedirectPayloadType>
        ) => {
          const { accessToken, user, expiresAt } = action.payload;

          state.status = LoadingStatusesEnum.SUCCESS;
          state.accessToken = accessToken;
          state.expiresAt = expiresAt;
          state.user = user;
        }
      )
      .addCase(signOut.fulfilled, (state: AuthStateType) => {
        state.status = LoadingStatusesEnum.SUCCESS;
        state.accessToken = undefined;
        state.user = undefined;
      })
      .addCase(
        renewToken.fulfilled,
        (
          state: AuthStateType,
          action: PayloadAction<HandleLoginRedirectPayloadType>
        ) => {
          const { accessToken, user, expiresAt } = action.payload;

          state.status = LoadingStatusesEnum.SUCCESS;
          state.accessToken = accessToken;
          state.expiresAt = expiresAt;
          state.user = user;
        }
      )
      .addMatcher(
        isAnyOf(
          signIn.pending,
          handleLoginRedirect.pending,
          signOut.pending,
          renewToken.pending
        ),
        (state: AuthStateType) => {
          state.status = LoadingStatusesEnum.LOADING;
          state.error = '';
        }
      )
      .addMatcher(
        isAnyOf(
          signIn.rejected,
          handleLoginRedirect.rejected,
          signOut.rejected,
          renewToken.rejected
        ),
        (state: AuthStateType, action) => {
          state.status = LoadingStatusesEnum.ERROR;
          state.error = action.payload || '';
        }
      );
  },
});

export const AuthSliceReducer = AuthSlice.reducer;
