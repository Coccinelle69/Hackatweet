import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

import styles from "./Tweet.module.css";

function Tweet({
  text,
  id,
  onDelete,
  isLastTweet,
  author,
  likes,
  likedBy,
  authorName,
  howLongAgo,
  onToggleLike,
  userPhoto,
}) {
  const user = useSelector((state) => state.users.value);
  const [likesCount, setLikesCount] = useState(likes);
  const currentActiveUserLiked = likedBy.find(
    (userId) => userId === user?.user?._id
  );
  const [isLiked, setIsLiked] = useState(currentActiveUserLiked ? true : false);
  const [userWhoLiked, setUserWhoLiked] = useState(currentActiveUserLiked);

  const words = text.split(" ");

  const deleteTweetHandler = async (tweetId) => {
    onDelete(tweetId);
  };

  const clickHeartHandler = async () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    console.log("clicked");
    let userLiked = user;

    onToggleLike(id);

    let count = isLiked ? -1 : 1;
    console.log(count);
    const response = await fetch(`http://localhost:3001/tweets/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ count }),
      body: JSON.stringify({ count, userLiked }),
    });
    const data = await response.json();

    setLikesCount(data.likes);
    setUserWhoLiked(count === 1 ? userLiked : null);
  };

  return (
    <div
      className={`${styles.tweetContainer} ${
        isLastTweet ? styles.lastTweet : ""
      }`}
    >
      <div className={styles.authorContainer}>
        {userPhoto ? (
          <Image
            src={userPhoto}
            alt="The image selected by user."
            style={{ cursor: "pointer", borderRadius: "50%" }}
            // className={styles.avatar}
            width={64}
            height={64}
          />
        ) : (
          <img
            src="/images/avatar.jpg"
            alt="avatar"
            className={styles.userPhoto}
          />
        )}

        <div className={styles.firstname}></div>
        <div className={styles.username}>
          <span style={{ color: "white" }}>{authorName}</span>@{author}
          <span>
            {" "}
            <span style={{ paddingTop: "5px" }}>·</span>
            <span> {howLongAgo}</span>
          </span>
        </div>
      </div>
      <div className={styles.tweetText}>
        {words.map((word, index) => (
          <span key={index}>
            {/* Render the word */}
            <span className={word.startsWith("#") ? styles.blue : ""}>
              {word}
            </span>
            {/* Render a space character if it's not the last word */}
            {index !== words.length - 1 && " "}
          </span>
        ))}
      </div>
      <div className={styles.tweetActions}>
        <span onClick={clickHeartHandler}>
          <FontAwesomeIcon
            icon={faHeart}
            color={!!userWhoLiked && isLiked ? "#B20000" : "white"}
            className={`${styles.heartIcon}`}
          />
          <span style={{ paddingLeft: "6px" }}>{likesCount}</span>
        </span>
        {author === user.username && (
          <FontAwesomeIcon
            icon={faTrash}
            className={styles.trashIcon}
            onClick={() => deleteTweetHandler(id)}
          />
        )}
      </div>
    </div>
  );
}

export default Tweet;
