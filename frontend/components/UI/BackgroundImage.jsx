import React from "react";

import styles from "./BackgroundImage.module.css";

function BackgroundImage() {
  return (
    <div className={styles.container}>
      <img className={styles.image} src="/images/twitterImage.png" />
      <img src="/images/logo.png" className={styles.logo} />
    </div>
  );
}

export default BackgroundImage;
