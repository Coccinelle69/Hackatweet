"use client";

import styles from "./page.module.css";
import LandingPage from "../pages/LandingPage";
import { Provider } from "react-redux";
import { store } from "../store/store";

export default function Home() {
  return (
    <Provider store={store}>
      <main className={styles.main}>
        <LandingPage />
      </main>
    </Provider>
  );
}
