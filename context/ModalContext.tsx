import { createSlice } from "@reduxjs/toolkit";

export const modalReducer = createSlice({
  name: "modal",
  initialState: { isOpened: false },
  reducers: {
    openModal(state) {
      state.isOpened = true;
    },
    closeModal(state) {
      state.isOpened = false;
    },
  },
});

export const modalActions = modalReducer.actions;
