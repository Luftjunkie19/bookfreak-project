import { createSlice } from "@reduxjs/toolkit";

export const messagesContext = createSlice({
  name: "messages",
  initialState: { isOpened: false },
  reducers: {
    toggleState(state) {
      state.isOpened = !state.isOpened;
    },
    closeState(state) {
      state.isOpened = false;
    },
  },
});

export const messagesActions = messagesContext.actions;
