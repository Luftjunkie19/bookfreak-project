import { configureStore } from "@reduxjs/toolkit";

import { burgerContext } from "./BurgerContext";
import { messagesContext } from "./MessContext";
import { modalReducer } from "./ModalContext";
import { notificationReducer } from "./NotificationReducer";
import { viewerContext } from "./ViewerContext";
import { warningContext } from "./WarningContext";

const stored = configureStore({
  reducer: {
    notifications: notificationReducer.reducer,
    modal: modalReducer.reducer,
    viewer: messagesContext.reducer,
    hamburger: burgerContext.reducer,
    notificationViewer: viewerContext.reducer,
    warning: warningContext.reducer,
  },
});

export default stored;
