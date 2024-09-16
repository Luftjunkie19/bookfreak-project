
import { createSlice } from '@reduxjs/toolkit';

export const modeReducer = createSlice({
  name: "mode",
  initialState: {
    isDarkMode: false, // Set a default initial state
  },
  reducers: {
    toggleDarkMode: (state) => {
      if (typeof window !== 'undefined') {
        // Only access window and localStorage in the browser
        state.isDarkMode = !state.isDarkMode;
        console.log(state.isDarkMode);
        window.localStorage.setItem("isDarkmode", JSON.stringify(state.isDarkMode));
      }
    },
    setInitialDarkMode: (state) => {
      if (typeof window !== 'undefined') {
        const storedMode = window.localStorage.getItem("isDarkmode");
        if (storedMode !== null) {
          state.isDarkMode = JSON.parse(storedMode);
        } else {
          state.isDarkMode = false; // Fallback default mode
        }
      }
    },
  },
});

// Export the action to set the initial dark mode
export const { toggleDarkMode, setInitialDarkMode } = modeReducer.actions;