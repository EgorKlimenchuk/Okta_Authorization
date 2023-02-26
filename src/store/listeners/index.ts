import {
  createListenerMiddleware,
  TypedStartListening,
} from '@reduxjs/toolkit';

import { addAuthListeners } from 'auth';
import { AppDispatch, RootState } from 'store';

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

const listeners: Array<(startListening: AppStartListening) => void> = [
  addAuthListeners,
];
listeners.forEach((listener) => listener(startAppListening));
