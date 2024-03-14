"use client";

import React from "react";
import HashtagPage from "../../pages/HashtagPage";
import { Provider } from "react-redux";
import { store } from "../../store/store";
function Hashtag() {
  return (
    <Provider store={store}>
      <div>
        <HashtagPage />
      </div>
    </Provider>
  );
}

export default Hashtag;
