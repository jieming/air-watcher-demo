import { configureStore } from '@reduxjs/toolkit'
import snackbarReducer from './snackbarSlice'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const store = configureStore({
    reducer: {
        snackbar: snackbarReducer,
    },
})
