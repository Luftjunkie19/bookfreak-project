import { createSlice } from '@reduxjs/toolkit';

export const snackBarReducer = createSlice({
  name: "snackbarAlert",
  initialState: {
    open:false,
    message:"",
    alertType:"",
  },
  reducers: {
    showMessage(state, action) {
        state.open=true;
        state.message=action.payload.message;
        state.alertType=action.payload.alertType ? action.payload.alertType : "";
    },
    hideMessage(state) {
    state.open=false;
    state.message="";
    }
  },
});

export const snackbarActions = snackBarReducer.actions;
