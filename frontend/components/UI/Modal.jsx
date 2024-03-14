import React from "react";
import styles from "./Modal.module.css";

function Modal({ open, onClose, children }) {
  const onClickHandler = () => {
    onClose();
  };
  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose}></div>}
      <dialog open={open} className={styles.dialog} id="modal">
        <div className={styles.closeBtnContainer}>
          <button className={styles.close} onClick={onClickHandler}>
            X
          </button>
        </div>
        <div className={styles.container}>
          <img className={styles.logo} src="/images/logo.png" />
          {children}
        </div>
      </dialog>
    </>
  );
}

export default Modal;
