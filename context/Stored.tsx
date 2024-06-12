import { configureStore } from '@reduxjs/toolkit';

import { burgerContext } from './BurgerContext';
import { languageContext } from './LanguageContext';
import { messagesContext } from './MessContext';
import { modalReducer } from './ModalContext';
import { modeReducer } from './ModeContext';
import { snackBarReducer } from './SnackBarContext';
import { viewerContext } from './ViewerContext';
import { warningContext } from './WarningContext';

const stored = configureStore({
  reducer: {
    modal: modalReducer.reducer,
    viewer: messagesContext.reducer,
    hamburger: burgerContext.reducer,
    notificationViewer: viewerContext.reducer,
    warning: warningContext.reducer,
    mode: modeReducer.reducer,
    languageSelection: languageContext.reducer,
    snackbarAlert:snackBarReducer.reducer,
  },
});

export default stored;
