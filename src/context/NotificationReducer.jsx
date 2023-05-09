import { createSlice } from "@reduxjs/toolkit";

export const notificationReducer = createSlice({
  name: "notifications",
  initialState: { notifications: 0, requests: 0 },
  reducers: {
    updateNotifications(state, action) {
      state.notifications = action.payload.notifications;
      state.requests = action.payload.requests;
    },
    readNotification(state) {
      state.notifications = state.notifications - 1;
    },
    readRequest(state) {
      state.requests = state.requests - 1;
    },
  },
});

export const notificationActions = notificationReducer.actions;
