import { createSlice } from "@reduxjs/toolkit";

export const burgerContext = createSlice({
  name: "burger",
  initialState: { isOpened: false, isUnloggedOpened: false },
  reducers: {
    toggleBurger(state) {
      state.isOpened = !state.isOpened;
    },

    toggleUnloggedBurger(state) {
      state.isUnloggedOpened = !state.isUnloggedOpened;
    },

    closedBurger(state) {
      state.isOpened = false;
    },

    closedUnloggedBurger(state) {
      state.isUnloggedOpened = false;
    },
  },
});

export const burgerActions = burgerContext.actions;
