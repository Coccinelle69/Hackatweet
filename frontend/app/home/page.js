"use client";

import React from "react";
import HomePage from "../../pages/HomePage";
import { Provider } from "react-redux";
import { store } from "../../store/store";

function Home() {
  return (
    <Provider store={store}>
      <div>
        <HomePage />
      </div>
    </Provider>
  );
}

export default Home;
