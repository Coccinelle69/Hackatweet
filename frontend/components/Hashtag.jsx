"use client";
import React from "react";
import styles from "./Hashtag.module.css";
import { useRouter } from "next/navigation";

function Hashtag({ text, count }) {
  const router = useRouter();
  return (
    <div
      className={styles.hashtagContainer}
      onClick={() => router.push("/hashtag")}
    >
      <div className={styles.hashtag}>{text}</div>
      <div className={styles.hashtagCount}>{count} Tweet</div>
    </div>
  );
}

export default Hashtag;
