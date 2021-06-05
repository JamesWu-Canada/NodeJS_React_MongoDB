import React from "react";
import { useHistory } from "react-router-dom";
import "./PageNotFound.css";

function PageNotFound() {
  const history = useHistory();
  return (
    <div className="PageNotFound">
      <div className="title">
        <div>Page not found</div>
        <button
          className="pageNotFound_login_button"
          onClick={() => history.push("/login")}
        >
          Login
        </button>
        <button
          className="pageNotFound_orderdisplay_button"
          onClick={() => history.push("/display")}
        >
          Order Display
        </button>
        <button
          className="pageNotFound_neworder_button"
          onClick={() => history.push("/neworder")}
        >
          New order
        </button>
        <button
          className="pageNotFound_home_button"
          onClick={() => history.push("/")}
        >
          Home
        </button>
      </div>
    </div>
  );
}
export default PageNotFound;
