import { Link } from "react-router-dom";
import { useState } from "react";
import InvalidCase from "../components/InvalidCase";
import classes from "./SignUp.module.css";
import Layout from "../components/Layout/Layout";
function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [formConstraints, setFormConstraints] = useState([]);

  //using state
  const [validUsername, setValidUsername] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const createAccount = async (e) => {
    e.preventDefault();

    try {
      const url = "http://localhost:5000/create_user";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        alert(`Request was unsuccessful, ${response}`);
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      alert(error);
    }
  };

  let keys = new Map();
  keys.set("Password is too short", 0);
  keys.set("Password is too long", 1);
  keys.set("Password does not contain symbols", 2);
  keys.set("Password does not contain numbers", 3);
  keys.set("Password does not contain uppercase letters", 4);
  keys.set("Password does not contain lowercase letters", 5);

  const symbols = "!@#$%^&*()_+{}|:\"<>?-=[]\\;',./";
  const numbers = "1234567890";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";

  function isValidUsername(username) {
    return username.length >= 5 && username.length <= 15;
  }

  /*
   * returns true if the password is valid and false if not
   */
  function isValidPassword(password) {
    let constraints = [];

    if (!(typeof password === "string")) {
      return false;
    }

    const symbols = "!@#$%^&*()_+{}|:\"<>?-=[]\\;',./";
    const numbers = "1234567890";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";

    // constraints
    let hasMinChars = password.length >= 8;
    let smallerThanMax = password.length <= 20;
    let containsS = false;
    let containsN = false;
    let containsU = false;
    let containsL = false;
    /*
     * 0: tooShort
     * 1: tooLong
     * 2: containsS
     * 3: containsN
     * 4: containsU
     * 5: containsL
     */

    for (let i = 0; i < password.length; i++) {
      let char = password[i];

      if (symbols.includes(char)) {
        containsS = true;
      }

      if (numbers.includes(char)) {
        containsN = true;
      }

      if (uppercase.includes(char)) {
        containsU = true;
      }

      if (lowercase.includes(char)) {
        containsL = true;
      }
    }

    const restraintPriority = [
      hasMinChars,
      smallerThanMax,
      containsS,
      containsN,
      containsU,
      containsL,
    ];

    //let constraints = "";
    let validPass = true;

    for (let i = 0; i < restraintPriority.length; i++) {
      let constraint = restraintPriority[i];
      validPass = validPass && constraint;

      switch (i) {
        case 0:
          if (!constraint) {
            constraints.push("Password is too short");
          }

          break;
        case 1:
          if (!constraint) {
            constraints.push("Password is too long");
          }

          break;
        case 2:
          if (!constraint) {
            constraints.push("Password does not contain symbols");
          }

          break;
        case 3:
          if (!constraint) {
            constraints.push("Password does not contain numbers");
          }

          break;
        case 4:
          if (!constraint) {
            constraints.push("Password does not contain uppercase letters");
          }

          break;
        case 5:
          if (!constraint) {
            constraints.push("Password does not contain lowercase letters");
          }

          break;

        default:
          constraints.push("Invalid Case Reached");
      }
    }

    setFormConstraints(constraints);

    return validPass;
  }

  /*
   * A username must be at least 5 characters, no more than 15
   * A password must be at least 8 characters & include 1 number and 1 special character, no more than 20
   */

  return (
    <Layout>
      <div>
        <br />
        <br />
        <br />
        <br />
        <h1 style={{ textAlign: "center" }}>Create Account</h1>
        <br />

        <div className={classes.elementsContainer}>
          <div className={classes.constraintArea}>
            {formConstraints.map((constraint) => {
              return (
                <InvalidCase
                  key={keys.get(constraint)}
                  text={"- " + constraint}
                />
              );
            })}
            <InvalidCase
              text={"- Username must be at least 5 characters and at most 15"}
              valid={validUsername ? "valid" : ""}
            />
          </div>

          <form className="sign-up-form">
            <label htmlFor="username" className={classes.usernameLabel}>
              Enter your username:
              <br />
            </label>

            <input
              type="text"
              id="username"
              placeholder="Username"
              required="required"
              onChange={(e) => {
                const isItValidUsername = isValidUsername(e.target.value);
                setValidUsername(isItValidUsername);
                // button should be disabled=true if both or one are false
                // button should be disabled=false if both are true
                let result = isItValidUsername && validPassword;
                setDisabled(!result);
                setUsername(e.target.value);
              }}
              className={classes.inputElement}
            />
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
              onChange={(e) => {
                const isItValidPassword = isValidPassword(e.target.value);
                setValidPassword(isItValidPassword);

                let results = validUsername && isItValidPassword;
                setDisabled(!results);

                setPassword(e.target.value);
              }}
              className={classes.inputElement}
            />

            <br />
            <br />

            <div className={classes.centerButtonLink}>
              <button
                type="submit"
                disabled={disabled}
                className={classes.button}
                onClick={createAccount}
              >
                Sign Up
              </button>

              <p>
                Already have an account? <Link to="/login">Log In</Link>
              </p>
            </div>
          </form>
        </div>

        <br />
      </div>
    </Layout>
  );
}

export default SignUp;
