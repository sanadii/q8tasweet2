// Its working

import React, { useState } from "react";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";


export default function SignIn() {
  const navigate = useNavigate();
  const initialFormData = Object.freeze({
    email: '',
    password: '',
  });

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    axiosInstance
      .post(`token/`, {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);
        axiosInstance.defaults.headers["Authorization"] =
          "JWT " + localStorage.getItem("accessToken");
        navigate("/", { replace: true });
        console.log(res);
        console.log(res.data);
      });
  };


  return (
    <div>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label>Email Address:</label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          onChange={handleChange}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          onChange={handleChange}
        />
        <br />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}