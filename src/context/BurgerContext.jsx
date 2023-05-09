import { createSlice } from "@reduxjs/toolkit";

export const burgerContext = createSlice({
  name: "burger",
  initialState: { isOpened: false },
  reducers: {
    toggleBurger(state) {
      state.isOpened = !state.isOpened;
    },

    closedBurger(state) {
      state.isOpened = false;
    },
  },
});

export const burgerActions = burgerContext.actions;
