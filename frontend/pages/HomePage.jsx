"use client";

import { useState, useEffect } from "react";
import styles from "../styles/HomePage.module.css";
import { useRouter } from "next/navigation";
import Tweet from "../components/Tweet";
import { addHashtag } from "../store/reducers/hashtags";
import { useDispatch, useSelector } from "react-redux";
import { extractHashtags, makeUnique } from "../util";
import { like, unlike } from "../store/reducers/likes";
import Modal from "../components/UI/Modal";
import ChangePhoto from "../components/Login/ChangePhoto";
import RightContainer from "../components/UI/RightContainer";
import LeftContainer from "../components/UI/LeftContainer";

function HomePage() {
  const [tweets, setTweets] = useState([]);
  const [hashtags, setHashtags] = useState();
  const [author, setAuthor] = useState("");
  const [inputIsEnabled, setInputIsEnabled] = useState(true);
  const user = useSelector((state) => state.users.value);
  const [tweetText, setTweetText] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState(user?.image || "");
  const likedTweets = useSelector((state) => state.likes.likedTweets) || [];

  console.log(user);

  const fetchTweets = async () => {
    const response = await fetch("http://localhost:3001/tweets");

    const responseData = await response.json();
    const tweets = responseData.tweets;
    let retrievedHashtags = [];
    for (let tweet of tweets) {
      retrievedHashtags.push(...tweet.hashtags);
    }

    const uniqueHashtags = makeUnique(retrievedHashtags);
    setHashtags(uniqueHashtags);

    setTweets(responseData.tweets);
    setAuthor(responseData.tweets[0].author.username);
  };

  useEffect(() => {
    if (!user.token) {
      return router.push("/");
    }
    fetchTweets();
  }, []);

  useEffect(() => {
    if (!user.token) {
      return router.push("/");
    }
    fetchTweets();
  }, [user.token]);

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

  const postTweetHandler = async () => {
    const extractedHashtags = extractHashtags(tweetText);
    const response = await fetch("http://localhost:3001/tweets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: tweetText,
        hashtags: extractedHashtags,
        authorId: user.user._id,
      }),
    });

    setTweetText("");
    fetchTweets();
    extractedHashtags.forEach((hashtag) => {
      dispatch(addHashtag({ text: hashtag }));
    });
  };

  const inputHandler = (value) => {
    if (!value) {
      return;
    }

    setTweetText(value);
    setInputIsEnabled(value.length < 280);
  };

  const deleteTweetHandler = async (tweetId) => {
    await fetch("http://localhost:3001/tweets/" + tweetId, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    fetchTweets();
  };

  const likeTweetHandler = (tweetId) => {
    const likedTweet = likedTweets.find((likedTweet) => likedTweet === tweetId);
    if (likedTweet) {
      dispatch(unlike(tweetId));
    } else {
      dispatch(like(tweetId));
    }
  };

  let transformedTweets;

  if (tweets && tweets.length > 0) {
    transformedTweets = tweets.map((tweet, index) => {
      return (
        <Tweet
          key={tweet._id}
          text={tweet.text}
          likes={tweet.likes}
          id={tweet._id}
          likedBy={tweet.likedBy}
          author={tweet.author.username}
          authorName={tweet.author.firstname}
          onDelete={deleteTweetHandler}
          onToggleLike={likeTweetHandler}
          howLongAgo={tweet.howLongAgo}
          isLastTweet={index === tweets.length - 1}
          userPhoto={tweet.author.image}
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
      <Modal open={modalIsOpen} onClose={closeModal}>
        <ChangePhoto
          open={modalIsOpen}
          userPhoto={userPhoto}
          onClose={closeModal}
          onSetPhoto={setUserPhoto}
        ></ChangePhoto>
      </Modal>

      <LeftContainer
        openModal={openModal}
        clickUserProfile={clickUserProfile}
        userPhoto={userPhoto}
      />
      <div className={styles.main}>
        <div className={styles.mainContainer}>
          <h2>Home</h2>
          <div className={styles.inputContainer}>
            <textarea
              type="text"
              placeholder="What's up?"
              onChange={(e) => inputHandler(e.target.value)}
              value={tweetText}
            />
          </div>
          <div className={styles.inputActions}>
            <span>{tweetText.length}</span>/<span>280</span>
            <button
              onClick={postTweetHandler}
              disabled={!inputIsEnabled}
              style={{
                backgroundColor: inputIsEnabled ? "#3690ed" : "darkgrey",
                cursor: inputIsEnabled ? "pointer" : "not-allowed",
              }}
            >
              Tweet
            </button>
          </div>
        </div>
        <div className={styles.tweetsContainer}>{transformedTweets}</div>
      </div>
      <RightContainer hashtags={hashtags} />
    </div>
  );
}

export default HomePage;
