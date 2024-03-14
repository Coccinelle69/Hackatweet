import React from "react";
import Hashtag from "../Hashtag";
import styles from "./RightContainer.module.css";

const RightContainer = ({ hashtags }) => {
  let transformedHashtags;

  if (hashtags && hashtags.length > 0) {
    const sortedHashtags = hashtags.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count; // Sort by count descending
      } else {
        return a.name.localeCompare(b.name); // Sort alphabetically if counts are equal
      }
    });

    transformedHashtags = sortedHashtags.map((hashtag, index) => (
      <Hashtag text={hashtag.name} count={hashtag.count} key={hashtag._id} />
    ));
  } else {
    transformedHashtags = (
      <p style={{ textAlign: "center", margin: "2rem" }}>No hashtags found.</p>
    );
  }
  return (
    <div className={styles.right}>
      <h2>Trends</h2>
      <div className={styles.hashtagsContainer}>{transformedHashtags}</div>
    </div>
  );
};

export default RightContainer;
