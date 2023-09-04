import React, { useState } from "react";
import axiosInstance from "./axios";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const initialFormData = Object.freeze({
    email: "esanad@gmail.com",
    password: "I4ksb@11782",
  });

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({
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
        const { access, refresh } = res.data;
        // Store the token in sessionStorage
        console.log("Access Token:", access);
        console.log("Refresh Token:", refresh);
        const authUser = {
          token: access,
          refreshToken: refresh,
        };
        sessionStorage.setItem("authUser", JSON.stringify(authUser));

        // Rest of your code...
      });
  };

  return (
    <div>
      <h1>Sign in</h1>
      <form>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit" onClick={handleSubmit}>
          Sign In
        </button>
      </form>
    </div>
  );
}
