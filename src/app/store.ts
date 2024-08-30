import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import boardReducer from "../features/board/board.slice";
import notificationReducer from "../features/notification/notification.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    notification: notificationReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
