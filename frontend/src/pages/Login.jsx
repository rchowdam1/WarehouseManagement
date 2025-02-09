import { Link } from "react-router-dom";
import SignUp from "./SignUp";
//import "./Login.css";
import classes from "./Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState("");

  // username must be at least 5 characters

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      /*const response = await fetch("http://localhost:5000/retrieve_user");
      const data = await response.json();
      console.log(data);*/

      const data = {
        username,
        password,
      };

      const url = "http://localhost:5000/retrieve_user";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        console.log(response);
        if (response.status === 403) {
          setLoginError("Incorrect Password Supplied");
        } else if (response.status === 401) {
          setLoginError("Incorrect Username Supplied");
        }
      } else {
        //console.log(response.status);
        const received = await response.json();
        console.log(received.user_id);
        setLoginError("");
        navigate("/landing", {
          state: {
            message: "hello",
            userID: received.user_id,
          },
        });
      }
    } catch (error) {
      alert(error);
    }

    /*const url = "http://localhost:5000/retrieve_user";
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    };*/

    /*const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);*/
  };

  return (
    <Layout>
      <div>
        <br />
        <br />
        <br />
        <br />
        <h1 style={{ textAlign: "center" }}>Welcome Back</h1>
        <br />
        <br />
        <div className={classes.loginError}>{loginError}</div>
        <div className={classes.elementsContainer}>
          <form onSubmit={onSubmit} className="login-form">
            <label htmlFor="username" className={classes.usernameLabel}>
              Enter your username:
              <br />
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              required="required"
              onChange={(e) => setUsername(e.target.value)}
              className={classes.inputElement}
            />
            <br />
            <br />
            <br />
            <label htmlFor="password" className={classes.passwordLabel}>
              Enter your password:
              <br />
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              required="required"
              onChange={(e) => setPassword(e.target.value)}
              className={classes.inputElement}
            />
            <br />
            <br />

            <div className={classes.centerButtonLink}>
              <button type="submit" className={classes.button}>
                Log In
              </button>

              <p>
                Don't have an account? <Link to="/sign-up">Create one</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
