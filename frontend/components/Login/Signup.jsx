"use client";

import React, { useEffect, useState } from "react";
import Input from "../UI/Input";
import style from "./Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/reducers/users";
import { useRouter } from "next/navigation";

function Signup() {
  const router = useRouter();

  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const [inputs, setInputs] = useState({
    firstname: "",
    username: "",
    password: "",
  });
  const signupHandler = async (e) => {
    e.preventDefault();

    const firstname = inputs.firstname;
    const username = inputs.username;
    const password = inputs.password;

    const reponse = await fetch("http://localhost:3001/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, username, password }),
    });
    const responseData = await reponse.json();
    if (!responseData.result) {
      setError(responseData.error);
      console.log(responseData.error);
      return;
    }
    dispatch(login({ username, token: responseData.token, firstname }));

    setInputs({
      firstname: "",
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
    <form className={style.form} onSubmit={signupHandler}>
      {error && <p className={style.error}>{error}</p>}
      <Input
        type="text"
        placeholder="Firstname"
        id="firstname"
        name="firstname"
        onChange={(e) => changeValuesHandler("firstname", e.target.value)}
        value={inputs.firstname}
      />
      <Input
        type="text"
        placeholder="Username"
        id="username"
        name="username"
        onChange={(e) => changeValuesHandler("username", e.target.value)}
        value={inputs.username}
      />
      <Input
        type="password"
        placeholder="Password"
        id="password"
        name="password"
        onChange={(e) => changeValuesHandler("password", e.target.value)}
        value={inputs.password}
      />
      <button className={style.btn} onClick={signupHandler}>
        Sign up
      </button>
    </form>
  );
}

export default Signup;
