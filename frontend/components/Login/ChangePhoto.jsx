"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./ChangePhoto.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { changeUserPhoto } from "../../store/reducers/users";

function ChangePhoto({ onClose, onSetPhoto, userPhoto, open }) {
  const [imagePicked, setImagePicked] = useState(null);
  const imageInput = useRef();
  const user = useSelector((state) => state.users?.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!open) {
      setImagePicked(null);
    }
  }, [open]);

  const handlePickClick = () => {
    imageInput.current.click();
  };

  const changePhotoHandler = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(
      `http://localhost:3001/users/upload/${user.user._id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log(data);
    setImagePicked(data.url);
  };

  const onConfirmHandler = () => {
    onClose();
    dispatch(changeUserPhoto(imagePicked));
    onSetPhoto(imagePicked);
    setImagePicked(null);
  };

  return (
    <>
      {!imagePicked && !userPhoto && (
        <img src="/images/avatar.jpg" alt="logo" className={styles.avatar} />
      )}
      {!imagePicked && userPhoto && (
        <Image
          src={userPhoto}
          alt="The image selected by user."
          className={styles.avatar}
          width={64}
          height={64}
        />
      )}
      {imagePicked && (
        <Image
          src={imagePicked}
          alt="The image selected by user."
          className={styles.avatar}
          width={64}
          height={64}
          //   fill
        />
      )}
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={changePhotoHandler}
        id="image"
        name="image"
        ref={imageInput}
        style={{ display: "none" }}
      />
      {!imagePicked && (
        <button
          type="button"
          onClick={handlePickClick}
          className={styles.button}
        >
          Change Photo
        </button>
      )}
      {imagePicked && (
        <div style={{ display: "flex" }}>
          <button
            type="button"
            onClick={onConfirmHandler}
            className={styles.button}
          >
            Confirm Change
          </button>
          <button
            type="button"
            onClick={handlePickClick}
            className={styles.buttonAlt}
          >
            Choose Another Image
          </button>
        </div>
      )}
    </>
  );
}

export default ChangePhoto;
