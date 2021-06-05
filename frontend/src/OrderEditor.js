import React from "react";
import "./OrderEditor.css";

function OrderEditor(props) {
  const { open, setOpen, order, setOrders, token } = props;
  //const {id, email, phone, work, status, comment} = order
  console.log(order);
  const [workType, setWorkType] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [comments, setComments] = React.useState("");

  const [phoneError, setPhoneError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);

  React.useEffect(() => {
    if (order) {
      setWorkType(order.work);
      setPhoneNumber(order.phone);
      setEmailAddress(order.email);
      setStatus(order.status);
      setComments(order.comment);
    }
  }, [order]);

  const phone1 = /\d{3}\s{1,}\d{3}\s{1,}\d{4}/;
  const phone2 = /\d{3}-\d{3}-\d{4}/;
  const phone3 = /^\d{10}$/;
  const email = /^([a-z\d\.-]+)@([a-z\d\-]+)\.([a-z]{2,5})(\.[a-z]{2,5})?$/;

  const correctPhone = () => {
    return (
      phone1.test(phoneNumber) ||
      phone2.test(phoneNumber) ||
      phone3.test(phoneNumber)
    );
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
    } else if (event.target.id === "status") {
      console.log(`status = ${event.target.value}`);
      setStatus(event.target.value);
    } else if (event.target.id === "comments") {
      console.log(`comment = ${event.target.value}`);
      setComments(event.target.value);
    }
  };

  const exitHandler = async () => {
    fetch("api/orders", {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      })
      .then(setOpen(false));
  };

  const submitHandler = async () => {
    let goodPhone = correctPhone();
    if (!goodPhone && phoneNumber !== "") {
      console.log("Invalid phone number");
      setPhoneError(true);
    } else {
      console.log("valid phone number");
      setPhoneError(false);
    }

    if (!email.test(emailAddress) && emailAddress !== "") {
      console.log("Invalid email");
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    fetch("api/order", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: order.id,
        work: workType === "" ? order.work : workType,
        phone: phoneNumber === "" ? order.phone : phoneNumber,
        email: emailAddress === "" ? order.email : emailAddress,
        status: status === "" ? order.status : status,
        comment: comments === "" ? order.comment : comments,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((error) => console.log("Error"));
  };

  if (!open) {
    return null;
  } else {
    return (
      <div className="Editor_Container">
        <button className="exit_order_editor_button" onClick={exitHandler}>
          X
        </button>
        {/* <div>
          <div>Current ID: {order.id}</div>
          <div>Current Work: {order.work}</div>
          <div>Current Phone: {order.phone}</div>
          <div>Current Email: {order.email}</div>
          <div>Current Status: {order.status}</div>
          <div>Current Comments: {order.comment}</div>
        </div> */}
        <p>New Work:</p>
        <input
          onChange={(event) => inputHandler(event)}
          type="text"
          id="workType"
          name="workType"
          value={workType}
        />
        <p>New Phone:</p>
        <input
          onChange={(event) => inputHandler(event)}
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
        />
        {phoneErrorMsg()}
        <p>New Email:</p>
        <input
          onChange={(event) => inputHandler(event)}
          type="text"
          id="emailAddress"
          name="emailAddress"
          value={emailAddress}
        />
        {emailErrorMsg()}
        <p>New Status:</p>
        <input
          onChange={(event) => inputHandler(event)}
          type="text"
          id="status"
          name="status"
          value={status}
        />
        <p>New Comments:</p>
        <input
          onChange={(event) => inputHandler(event)}
          type="text"
          id="comments"
          name="comments"
          value={comments}
        />
        <button className="save_button" onClick={submitHandler}>
          Save
        </button>
      </div>
    );
  }
}

export default OrderEditor;
