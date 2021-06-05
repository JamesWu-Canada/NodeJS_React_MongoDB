import React from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";
const bcrypt = require("bcryptjs");

const email = /^([a-z\d\.-]+)@([a-z\d\-]+)\.([a-z]{2,6})(\.[a-z]{2,5})?$/;

function Login(props) {
  const {
    logged_in,
    set_logged_in,
    logged_in_email,
    set_logged_in_email,
    setIsAdmin,
    setToken,
  } = props;
  console.log(`props login = ${logged_in}`);
  const [emailAddress, setEmailAddress] = React.useState(logged_in_email);
  const [password, setPassword] = React.useState("");
  const [invalidEmailError, setInvalidEmailError] = React.useState(false);
  const [emailDoesntExistError, setEmailDoesntExistError] =
    React.useState(false);
  const [emailAlreadyExistError, setEmailAlreadyExistError] =
    React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [wrongPassword, setWrongPassword] = React.useState(false);
  const [signUp, setSignUp] = React.useState(false);
  const [signIn, setSignIn] = React.useState(true);

  const adminEmail = "mr.jamesy.wu@gmail.com";
  const adminPassword = "123";

  React.useEffect(() => {
    // send Http GET Method
    //fetch("http://localhost:4000/users")
    fetch("api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });

    //empty array means this effect runs once
  }, []);

  const inputHandler = (event) => {
    console.log("inputHandler");
    if (!logged_in) {
      if (event.target.id === "emailAddress") {
        console.log(`emailAddress = ${event.target.value}`);
        setEmailAddress(event.target.value);
        set_logged_in_email(event.target.value);
      } else if (event.target.id === "password") {
        console.log(`password = ${event.target.value}`);
        setPassword(event.target.value);
      }
    }
  };

  const submitHandler = () => {
    if (!email.test(emailAddress)) {
      console.log("Invalid email");
      setInvalidEmailError(true);
      return;
    } else {
      setInvalidEmailError(false);
    }

    var foundUser = users.filter((user) => {
      return user.email === emailAddress;
    })[0];

    if (signIn) {
      if (foundUser === undefined) {
        console.log("email doesn't exist");
        setEmailDoesntExistError(true);
        return;
      } else {
        setEmailDoesntExistError(false);
        console.log(foundUser);
        if (bcrypt.compareSync(password, foundUser.password)) {
          //console.log("logged in");
          setWrongPassword(false);
          set_logged_in(true);

          if (logged_in_email === adminEmail && password === adminPassword) {
            setIsAdmin(true);
          }

          //fetch("http://localhost:4000/token", {
          fetch("api/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: emailAddress,
            }),
          })
            .then((res) => {
              return res.json();
            })
            .then((resp_data) => {
              setToken(resp_data.token);
              console.log(resp_data.token);
              let decoded = JSON.parse(atob(resp_data.token.split(".")[1]));
              console.log(decoded);
            })
            .catch((error) => (console.log("Error"), set_logged_in(false)));
        } else {
          console.log("wrong password");
          setWrongPassword(true);
        }
      }
    } else if (signUp) {
      if (foundUser !== undefined) {
        console.log("email already exists");
        setEmailAlreadyExistError(true);
        return;
      } else {
        console.log(password);
        setEmailAlreadyExistError(false);
        //fetch("http://localhost:4000/user", {
        fetch("api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailAddress,
            password: password,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((resp_data) => {
            set_logged_in(true);
            console.log(resp_data);
            setToken(resp_data.token);
            console.log(resp_data.token);
            let decoded = JSON.parse(atob(resp_data.token.split(".")[1]));
            console.log(decoded);
          })
          .catch((error) => (console.log("Error"), set_logged_in(false)));
        //empty array means this effect runs once
      }
    }
  };

  const signUp_signIn_Handler = () => {
    setSignUp(!signUp);
    setSignIn(!signIn);
    setEmailDoesntExistError(false);
    setEmailAlreadyExistError(false);
  };

  const LogoutHandler = () => {
    set_logged_in(false);
    setIsAdmin(false);
  };

  const emailErrorMsg = () => {
    if (invalidEmailError) {
      return <div className="error">jhon@example.com</div>;
    } else if (emailDoesntExistError) {
      return <div className="error">Email doesn't exist</div>;
    } else if (emailAlreadyExistError) {
      return <div className="error">Email already exists</div>;
    } else return null;
  };

  const history = useHistory();
  <button className="login_logout_button" onClick={LogoutHandler}>
    Log out
  </button>;

  return (
    <div className="LogIn">
      <div className="title">
        <div>Login Form</div>
        <button
          className="orderdisplay_button"
          onClick={() => history.push("/display")}
        >
          Order Display
        </button>
        <button
          className="login_neworder_button"
          onClick={() => history.push("/neworder")}
        >
          New Order
        </button>
        <button
          className="login_contact_button"
          onClick={() => history.push("/contact")}
        >
          Contact
        </button>

        {logged_in && (
          <button className="login_logout_button" onClick={LogoutHandler}>
            Log out
          </button>
        )}
      </div>
      <div className="introduction">Client login page</div>

      <div className="login_input">
        <div className="login_title">Input email and password here:</div>
        <div className="login_body">
          <p>Email address:</p>
          <input
            onChange={(event) => inputHandler(event)}
            type="text"
            id="emailAddress"
            name="emailAddress"
            value={emailAddress}
          />
          {emailErrorMsg()}
          <p>Password:</p>
          <input
            onChange={(event) => inputHandler(event)}
            type="text"
            id="password"
            name="password"
            value={password}
          />
          {wrongPassword && signIn && !logged_in && (
            <div className="wrong_password">wrong password</div>
          )}
          {logged_in && (
            <div className="signIn_success">logged in sucessfully</div>
          )}
        </div>
        <div>
          <button className="submission_button" onClick={submitHandler}>
            {signIn ? "Log in" : "Sign up"}
          </button>
        </div>
        {signIn ? (
          <div style={{ fontSize: "15px" }}>
            Don't have an account?{" "}
            <div className="sign_up_sign_in" onClick={signUp_signIn_Handler}>
              Sign up
            </div>
          </div>
        ) : (
          <div className="sign_up_sign_in" onClick={signUp_signIn_Handler}>
            Sign in
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
