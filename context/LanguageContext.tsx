import { createSlice } from '@reduxjs/toolkit';

export const languageContext = createSlice({
  name: "languages",
  initialState: {
    selectedLangugage: JSON.parse(localStorage.getItem("selectedLang") as string)
      ? JSON.parse(localStorage.getItem("selectedLang") as string)
      : "eng",
  },
  reducers: {
    selectLanguage: (state, action) => {
      localStorage.setItem("selectedLang", JSON.stringify(action.payload));

      state.selectedLangugage = action.payload;
    },
  },
});

export const languageActions = languageContext.actions;
