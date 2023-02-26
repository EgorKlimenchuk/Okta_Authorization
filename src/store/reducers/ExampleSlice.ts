import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getErrorMessage } from 'api';

const initialState = {
  data: '',
};

export const getData = createAsyncThunk(
  'getData',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    try {
      const data = 'You are authorizen';
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
