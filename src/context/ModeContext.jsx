import { createSlice } from "@reduxjs/toolkit";

export const modeReducer = createSlice({
  name: "mode",
  initialState: {
    isDarkMode:
      JSON.parse(localStorage.getItem("isDarkmode")) === null
        ? true
        : JSON.parse(localStorage.getItem("isDarkmode")),
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      console.log(state.isDarkMode);
      localStorage.setItem("isDarkmode", JSON.stringify(state.isDarkMode));
    },
  },
});

export const modeActions = modeReducer.actions;
