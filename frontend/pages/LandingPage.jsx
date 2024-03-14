"use client";

import Button from "../components/UI/Button";
import styles from "../styles/LandingPage.module.css";
import BackgroundImage from "../components/UI/BackgroundImage";
import Modal from "../components/UI/Modal";
import { useState } from "react";
import Signin from "../components/Login/Signin";
import Signup from "../components/Login/Signup";

function LandingPage() {
  const [mode, setMode] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const setModeHandler = (loginMode) => {
    setMode(loginMode);
    console.log(mode);
  };

  const openModal = () => {
    setModalIsOpen((prevState) => !prevState);
  };

  const closeModal = () => {
    setModalIsOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.main}>
      {modalIsOpen && (
        <div className={styles.backdrop} onClick={closeModal}></div>
      )}
      <Modal open={modalIsOpen} onClose={closeModal}>
        <h2>
          {mode === "signup"
            ? "Create your Hackatweet account"
            : "Connect to Hackatweet"}
        </h2>
        {mode === "signup" && <Signup></Signup>}
        {mode === "signin" && <Signin></Signin>}
      </Modal>
      <div className={styles.imageContainer}>
        <BackgroundImage />
      </div>
      <div className={styles.introContainer}>
        <img src="/images/logo.png" className={styles.logo} />
        <h1 className={styles.title}>See what&apos;s happening</h1>
        <p className={styles.joinText}>Join Hackatweet today.</p>
        <div className={styles.buttonContainer}>
          <Button mode="signup" onSetMode={setModeHandler} onOpen={openModal}>
            Sign up
          </Button>
          <p className={styles.account}>Already have an account?</p>
          <Button mode="signin" onSetMode={setModeHandler} onOpen={openModal}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
