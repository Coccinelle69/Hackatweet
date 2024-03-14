import React from "react";
import styles from "./Button.module.css";

function Button({ children, mode, onSetMode, onOpen }) {
  const clickHandler = () => {
    onSetMode(mode);
    onOpen();
  };
  const classStyle = mode === "signup" ? styles.signup : styles.signin;
  return (
    <button className={`${styles.btn} ${classStyle}`} onClick={clickHandler}>
      {children}
    </button>
  );
}

export default Button;
