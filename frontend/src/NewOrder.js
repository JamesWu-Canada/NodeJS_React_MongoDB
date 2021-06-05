import React from "react";
import { useHistory } from "react-router-dom";
import "./NewOrder.css";

const phone1 = /\d{3}\s{1,}\d{3}\s{1,}\d{4}/;
const phone2 = /\d{3}-\d{3}-\d{4}/;
const phone3 = /^\d{10}$/;
const email = /^([a-z\d\.-]+)@([a-z\d\-]+)\.([a-z]{2,5})(\.[a-z]{2,5})?$/;

function NewOrder({ token }) {
  const [workType, setWorkType] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [phoneError, setPhoneError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);

  const correctPhone = () => {
    return (
      phone1.test(phoneNumber) ||
      phone2.test(phoneNumber) ||
      phone3.test(phoneNumber)
    );
  };

  // const generateIDS = (orders) => {
  //   for (let i = 0; i < orders.length; i++) {
  //     orders[i].id = i;
  //   }
  // };

  const generateID = async () => {
    //var nextId = 0;
    try {
      let response = await fetch("api/orders", {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      let data = await response.json();
      console.log(data);
      /*fetch("http://localhost:4000/orders")
          .then((response) => response.json())
          .then((data) => {
            //ordersGlobal = data;*/
      let i = 1;
      let idArray = data.map((d) => d.id);
      console.log(idArray);
      while (idArray.includes(i)) {
        i++;
      }
      var nextId = i;
      console.log(nextId);
      return nextId;
      // });
    } catch (err) {
      console.log(err);
    }
  };

  const submitHandler = async () => {
    let nextId = await generateID();
    console.log(`nextId = ${nextId}`);
    console.log("submit buttom clicked");
    let goodPhone = correctPhone();
    if (!goodPhone) {
      console.log("Invalid phone number");
      setPhoneError(true);
    } else {
      console.log("valid phone number");
      setPhoneError(false);
    }

    if (!email.test(emailAddress)) {
      console.log("Invalid email");
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    fetch("api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: nextId,
        work: workType,
        phone: phoneNumber,
        email: emailAddress,
        status: "pending",
        comment: "",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.log("Error"));
  };

  const inputHandler = (event) => {
    console.log("inputHandler");
    const { id, value } = event.target; // destructuring of object, id=event.target.id
    //console.log(`id ${id} 's value = ${value}`);
    if (event.target.id === "workType") {
      console.log(`workType = ${event.target.value}`);
      setWorkType(event.target.value);
    } else if (event.target.id === "phoneNumber") {
      console.log(`phoneNumber = ${event.target.value}`);
      setPhoneNumber(event.target.value);
    } else if (event.target.id === "emailAddress") {
      console.log(`emailAddress = ${event.target.value}`);
      setEmailAddress(event.target.value);
    }
  };

  const phoneErrorMsg = () => {
    if (phoneError === true) {
      return (
        <div className="error">5148888888 or 514 888 888 or 514-888-8888</div>
      );
    } else return null;
  };

  const emailErrorMsg = () => {
    if (emailError === true) {
      return <div className="error">jhon@example.com</div>;
    } else return null;
  };

  const history = useHistory();

  return (
    <div className="NewOrder">
      <div className="title">
        <div>New Order Enter Form</div>
        <button
          className="neworder_login_button"
          onClick={() => history.push("/login")}
        >
          Login
        </button>
        <button
          className="orderdisplay_button"
          onClick={() => history.push("/display")}
        >
          Order Display
        </button>
        <button
          className="neworder_contact_button"
          onClick={() => history.push("/Contact")}
        >
          Contact
        </button>
      </div>
      <div className="introduction">
        You will need to create new orders in MongoDB by Http Method POST or PUT
      </div>

      <div className="order_input">
        <div className="order_title">Input the painting request here:</div>
        <div className="order_body">
          <p>Type of work:</p>
          <input
            onChange={(event) => inputHandler(event)}
            type="text"
            id="workType"
            name="workType"
            value={workType}
            className="work_type"
          />
          <p>Phone number:</p>
          <input
            onChange={(event) => inputHandler(event)}
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={phoneNumber}
            className="phone_number"
          />
          {/*phoneError === true && (
            <div className="error">
              5148888888 or 514 888 888 or 514-888-8888
            </div>
          )*/}
          {phoneErrorMsg()}

          <p>Email address:</p>
          <input
            onChange={(event) => inputHandler(event)}
            type="text"
            id="emailAddress"
            name="emailAddress"
            value={emailAddress}
            className="email_address"
          />
          {emailErrorMsg()}
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

export default NewOrder;
