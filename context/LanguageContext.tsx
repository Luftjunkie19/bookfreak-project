import { createSlice } from '@reduxjs/toolkit';

export const languageContext = createSlice({
  name: "languages",
  initialState: {
    selectedLangugage: typeof window !== 'undefined' && JSON.parse(localStorage.getItem("selectedLang") as string)
      ? JSON.parse(localStorage.getItem("selectedLang") as string)
      : "eng",
  },
  reducers: {
    selectLanguage: (state, action) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem("selectedLang", JSON.stringify(action.payload));

        state.selectedLangugage = action.payload;
      }
    },
  },
});

export const languageActions = languageContext.actions;
