import React, { useState } from "react";
import Input from "../UI/Input";
import style from "./Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/reducers/users";
import { useRouter } from "next/navigation";

function Signin() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [error, setError] = useState("");

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const signinHandler = async (e) => {
    e.preventDefault();
    const username = inputs.username;
    const password = inputs.password;

    const reponse = await fetch("http://localhost:3001/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const responseData = await reponse.json();
    if (!responseData.result) {
      setError(responseData.error);
      console.log(responseData.error);
      return;
    }

    const user = responseData.user;

    console.log(responseData.user);
    dispatch(
      login({
        username,
        token: responseData.token,
        firstname: user.firstname,
        user,
      })
    );
    setInputs({
      username: "",
      password: "",
    });

    router.push("/home");
  };

  const changeValuesHandler = (identifier, value) => {
    setError("");
    setInputs((prevInputValues) => ({
      ...prevInputValues,
      [identifier]: value,
    }));
  };

  return (
    <form className={style.form} onSubmit={signinHandler}>
      {error && <p className={style.error}>{error}</p>}

      <Input
        type="text"
        placeholder="Username"
        id="username"
        name="username"
        onChange={(e) => changeValuesHandler("username", e.target.value)}
      />
      <Input
        onChange={(e) => changeValuesHandler("password", e.target.value)}
        type="password"
        placeholder="Password"
        id="password"
        name="password"
      />
      <button className={style.btn} onClick={signinHandler}>
        Sign up
      </button>
    </form>
  );
}

export default Signin;
