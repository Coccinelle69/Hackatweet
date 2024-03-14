"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/HastagPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import Tweet from "../components/Tweet";
import { like, unlike } from "../store/reducers/likes";
import Modal from "../components/UI/Modal";
import ChangePhoto from "../components/Login/ChangePhoto";
import RightContainer from "../components/UI/RightContainer";
import LeftContainer from "../components/UI/LeftContainer";

function HashtagPage() {
  const user = useSelector((state) => state.users.value);
  const dispatch = useDispatch();
  const [searchedTweets, setSearchedTweets] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [userPhoto, setUserPhoto] = useState(user?.image || "");

  const likedTweets = useSelector((state) => state.likes.likedTweets) || [];

  useEffect(() => {
    const fetchHashtags = async () => {
      const response = await fetch("http://localhost:3001/hashtags");
      const data = await response.json();

      console.log(data);
      setHashtags(data.hashtags);
    };

    fetchHashtags();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(
        `http://localhost:3001/users/${user.user._id}`
      );
      const data = await response.json();
      setUserPhoto(data.user.image);
    };

    getUser();
  }, [userPhoto]);

  const handleKeyDown = async (event) => {
    let searchWord = keyword.split("#")[1];
    if (event.key === "Enter") {
      try {
        const response = await fetch(
          `http://localhost:3001/hashtags/${searchWord}`
        );
        const data = await response.json();
        console.log(data.tweets);
        setSearchedTweets(data.tweets);
        setKeyword("");
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    }
  };

  const deleteTweetHandler = async (tweetId) => {
    await fetch("http://localhost:3001/tweets/" + tweetId, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    fetchTweets();
  };

  let transformedTweets;

  const likeTweetHandler = (tweetId) => {
    const likedTweet = likedTweets.find((likedTweet) => likedTweet === tweetId);
    if (likedTweet) {
      dispatch(unlike(tweetId));
    } else {
      dispatch(like(tweetId));
    }
  };

  if (searchedTweets && searchedTweets.length > 0) {
    transformedTweets = searchedTweets.map((tweet, index) => {
      console.log(tweet.likes);
      return (
        <Tweet
          key={tweet._id}
          text={tweet.text}
          likes={tweet.likes}
          likedBy={tweet.likedBy}
          id={tweet._id}
          author={tweet.author.username}
          authorName={tweet.author.firstname}
          onDelete={deleteTweetHandler}
          onToggleLike={likeTweetHandler}
          howLongAgo={tweet.howLongAgo}
          userPhoto={tweet.author.image}
          isLastTweet={index === searchedTweets.length - 1}
        />
      );
    });
  } else {
    transformedTweets = (
      <p style={{ textAlign: "center", margin: "2rem" }}>No tweets found.</p>
    );
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const clickUserProfile = () => {
    console.log("clicked");
    openModal();
  };

  const openModal = () => {
    setModalIsOpen((prevState) => !prevState);
  };

  const closeModal = () => {
    setModalIsOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.container}>
      {modalIsOpen && (
        <div className={styles.backdrop} onClick={closeModal}></div>
      )}
      <Modal open={modalIsOpen} onClose={closeModal}>
        <ChangePhoto
          onClose={closeModal}
          onSetPhoto={setUserPhoto}
        ></ChangePhoto>
      </Modal>

      <LeftContainer
        userPhoto={userPhoto}
        clickUserProfile={clickUserProfile}
        openModal={openModal}
      />
      <div className={styles.main}>
        <div className={styles.mainContainer}>
          <h2>Hashtags</h2>
          <div className={styles.inputContainer}>
            <input
              // disabled={!inputIsEnabled}
              type="text"
              placeholder="#hackatweet"
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              value={keyword}
            />
          </div>
        </div>
        <div className={styles.tweetsContainer}>{transformedTweets}</div>
      </div>
      <RightContainer hashtags={hashtags} />
    </div>
  );
}

export default HashtagPage;
