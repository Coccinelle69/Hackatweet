import Image from "next/image";
import Link from "next/link";
import styles from "./LeftContainer.module.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/reducers/users";
import { useRouter } from "next/navigation";

const LeftContainer = ({ userPhoto, openModal, clickUserProfile }) => {
  const user = useSelector((state) => state.users.value);
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = () => {
    router.replace("/home");
    dispatch(logout());
  };

  return (
    <div className={styles.left}>
      <Link href="/home">
        <img src="/images/logo.png" alt="logo" style={{ cursor: "pointer" }} />
      </Link>
      <div className={styles.leftContainer}>
        <div className={styles.userContainer}>
          {!userPhoto && (
            <img
              src="/images/avatar.jpg"
              alt="avatar"
              className={styles.avatar}
              style={{ cursor: "pointer" }}
              onClick={openModal}
            />
          )}

          {userPhoto && (
            <Image
              src={userPhoto}
              alt="The image selected by user."
              style={{ cursor: "pointer", borderRadius: "50%" }}
              // className={styles.avatar}
              width={64}
              height={64}
              onClick={clickUserProfile}
            />
          )}
          <div className={styles.userInfo}>
            <div className={styles.firstname}>{user.firstname}</div>
            <div className={styles.username}>@{user.username}</div>
          </div>
        </div>
        <button onClick={logoutHandler}>Logout</button>
      </div>
    </div>
  );
};

export default LeftContainer;
