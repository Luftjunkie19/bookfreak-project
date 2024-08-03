import { createSlice } from '@reduxjs/toolkit';

export const modeReducer = createSlice({
  name: "mode",
  initialState: {
    isDarkMode:
     typeof window !== 'undefined' && JSON.parse(localStorage.getItem("isDarkmode") as string) === null
        ? true
        : JSON.parse(localStorage.getItem("isDarkmode") as string),
  },
  reducers: {
    toggleDarkMode: (state) => {
      if (typeof window !== 'undefined') {        
        state.isDarkMode = !state.isDarkMode;
        console.log(state.isDarkMode);
        localStorage.setItem("isDarkmode", JSON.stringify(state.isDarkMode));
      }
    },
  },
});

export const modeActions = modeReducer.actions;
