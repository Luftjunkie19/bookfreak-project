import { createSlice } from '@reduxjs/toolkit';

export const warningContext = createSlice({
  name: "warning",
  initialState: {
    isWarningVisible: false,
    referedTo: null,
    typeOf: null,
    collection: null,
  },

  reducers: {
    openWarning(state, action) {
      state.isWarningVisible = true;
      state.referedTo = action.payload.referedTo;
      state.typeOf = action.payload.typeOf;
      state.collection = action.payload.collection;
    },
    closeWarning(state) {
      state.isWarningVisible = false;
      state.referedTo = null;
      state.typeOf = null;
    },
  },
});

export const warningActions = warningContext.actions;
