import { createSlice } from "@reduxjs/toolkit";

export const viewerContext = createSlice({
  name: "messages",
  initialState: { isOpened: false },
  reducers: {
    toggleState(state) {
      state.isOpened = !state.isOpened;
    },
  },
});

export const viewerActions = viewerContext.actions;
