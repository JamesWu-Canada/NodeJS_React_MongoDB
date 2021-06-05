import React from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

class Contact extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      subject: "",
      message: "",
      emailStatus: "Pending",
    };
  }

  render() {
    const inputHandler = (event) => {
      console.log("inputHandler");
      const { id, value } = event.target; // destructuring of object, id=event.target.id
      //console.log(`id ${id} 's value = ${value}`);
      if (event.target.id === "emailAddress") {
        console.log(`emailAddress = ${event.target.value}`);
        this.setState({ email: event.target.value });
      } else if (event.target.id === "subject") {
        console.log(`subject = ${event.target.value}`);
        this.setState({ subject: event.target.value });
      } else if (event.target.id === "message") {
        console.log(`message = ${event.target.value}`);
        this.setState({ message: event.target.value });
      }
    };

    const submitHandler = async () => {
      console.log("sending POST");
      console.log(this.state);

      fetch("api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => console.log(data))
        .catch((error) => console.log("Error"));
    };

    return (
      <div className="Contact">
        <div className="title">
          <div>Contact</div>
          <Link to={"/login"}>
            <div className="contact_login_button">Login</div>
          </Link>

          <Link to={"/display"}>
            <div className="contact_orderdisplay_button">Order Display</div>
          </Link>

          <Link to={"/neworder"}>
            <div className="contact_neworder_button">New order</div>
          </Link>
          <Link to={"/"}>
            <div className="contact_home_button">Home</div>
          </Link>
        </div>
        <div className="introduction">
          To contact us, enter your email, subject and message.
        </div>

        <div className="contact_input">
          <div className="contact_input_title">
            Input email, subject and message here:
          </div>
          <div className="input_body">
            <p>Email:</p>
            <input
              className="email_address"
              onChange={(event) => inputHandler(event)}
              type="text"
              id="emailAddress"
              name="emailAddress"
            />

            <p>Subject:</p>
            <input
              className="subject"
              onChange={(event) => inputHandler(event)}
              type="text"
              id="subject"
              name="subject"
            />

            <p>Message:</p>
            <input
              className="message"
              onChange={(event) => inputHandler(event)}
              type="text"
              id="message"
              name="message"
            />
          </div>
          <div>
            <button className="submission_button" onClick={submitHandler}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Contact;
