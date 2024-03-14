"use client";

import React from "react";
import ChatPage from "../../pages/ChatPage";
import { Provider } from "react-redux";
import { store } from "../../store/store";
function Chat() {
  return (
    <Provider store={store}>
      <div>
        <ChatPage />
      </div>
    </Provider>
  );
}

export default Chat;
