import React, { useState } from 'react';
import Axios from 'axios';
import Cookies from 'universal-cookie';

const SlideNavbar = ({ setIsAuth }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({ username: "", email: "", phone: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const cookies = new Cookies();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const login = (event) => {
    event.preventDefault();
Axios.post("https://online-special-ttt-production.up.railway.app/login", { username, password })
  .then((res) => {
    if (res.status === 200) {
      const { firstName, lastName, username, token, userId, message } = res.data;
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("username", username);
      cookies.set("firstName", firstName);
      cookies.set("lastName", lastName);
      setIsAuth(true);
      setMessage(message || "Login successful!");
      setMessageType("success");
    } else {
      setMessage("Unexpected response from the server.");
      setMessageType("error");
    }
  })
  .catch((error) => {
    console.error("Login error:", error);
    if (error.response) {
      if (error.response.status === 404) {
        setMessage("User not found.");
        setMessageType("error");
      } else if (error.response.status === 401) {
        setMessage("Invalid password.");
        setMessageType("error");
      } else {
        setMessage(error.response.data.message || "An error occurred during login. Please try again later.");
        setMessageType("error");
      }
    } else {
      setMessage("Network error. Please check your connection.");
      setMessageType("error");
    }
  });
  };

  const signUp = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:8000/signup", user)
      .then((res) => {
        const { token, userId, firstName, lastName, username, hashedPassword, message } = res.data;

        if (res.status === 201 || res.status === 409) {
          cookies.set("token", token);
          cookies.set("userId", userId);
          cookies.set("username", username);
          cookies.set("firstName", firstName);
          cookies.set("lastName", lastName);
          cookies.set("hashedPassword", hashedPassword);
          setIsAuth(true);
          setMessage(message || "Signup successful!");
          setMessageType("success");
        } else {
          setMessage(message);
          setMessageType("error");
        }
      })
      .catch((error) => {
        console.error("Signup error:", error);
        setMessage("An error occurred during signup. Please try again later.");
        setMessageType("error");


    console.error("Login error:", error);
    if (error.response) {
      if (error.response.status === 409) {
        setMessage("Username already exists. Please choose another one.");
        setMessageType("error");
      } else {
        setMessage(error.response.data.message || "An error occurred during login. Please try again later.");
        setMessageType("error");
      }
    } else {
      setMessage("Network error. Please check your connection.");
      setMessageType("error");
    }
      });
  };

  return (
    <div className="main">
      {message && (
        <div
          className="error"
          style={{
            color: messageType === "success" ? "green" : "red",
            margin: "10px 0",
            position: "absolute",
            top: "0",
          }}
        >
          {message}
        </div>
      )}
      <input
        type="checkbox"
        id="chk"
        aria-hidden="true"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <div className="signup">
        <form onSubmit={signUp}>
          <label htmlFor="chk" aria-hidden="true">Sign up</label>
          <input
            placeholder="First Name"
            required
            onChange={(event) => {
              setUser({ ...user, firstName: event.target.value });
            }}
          />
          <input
            placeholder="Last Name"
            required
            onChange={(event) => {
              setUser({ ...user, lastName: event.target.value });
            }}
          />
          <input
            placeholder="Username"
            required
            onChange={(event) => {
              setUser({ ...user, username: event.target.value });
            }}
          />
          <input
            placeholder="Password"
            required
            type="password"
            onChange={(event) => {
              setUser({ ...user, password: event.target.value });
            }}
          />
          <button type="submit">Sign up</button>
        </form>
      </div>

      <div className="login">
        <form onSubmit={login}>
          <label htmlFor="chk" aria-hidden="true">Login</label>
          <input
            placeholder="Username"
            required
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default SlideNavbar;
