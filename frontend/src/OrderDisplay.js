import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import OrderEditor from "./OrderEditor";
import "./OrderDisplay.css";

//function OrderDisplay(props) {
function OrderDisplay({ isAdmin, logged_in, logged_in_email, token }) {
  const [orders, setOrders] = React.useState(null);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editorOrder, setEditorOrder] = React.useState(null);

  React.useEffect(() => {
    // send Http GET Method
    if (isAdmin && token) {
      fetch("api/orders", {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.message && data.message === "token older than 24 hour") {
            return;
          }
          setOrders(data);
        });
    } else if (logged_in && token) {
      var url = "api/orders/".concat(logged_in_email);
      fetch(url, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message && data.message === "token older than 24 hour") {
            return;
          }
          setOrders(data);
        });
    }

    //empty array means this effect runs once
  }, []);

  const history = useHistory();

  const editOrderHandler = (selectedOrder) => {
    //console.log(selectedOrder);
    setEditorOpen(true);
    setEditorOrder(selectedOrder);
  };

  const deleteButtonHandler = (orderID) => {
    fetch("api/order/".concat(orderID), {
      method: "DELETE",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
        //console.log(res);
      })
      .then((data) => {
        // console.log(data);
        // console.log(`deleted order id = ${orderID}`);
        let newOrders = [];
        orders.forEach((element) => {
          if (element.id !== orderID) {
            newOrders.push(element);
          }
        });
        setOrders(newOrders);
      })
      .catch((error) => console.log("Error"));

    /*fetch("http://localhost:4000/orders")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      });*/

    //displayList();
  };

  const displayList = () => {
    if (orders === null) {
      return null;
    } else {
      return orders.map((order) => {
        return (
          <tr key={order._id}>
            <td>{order.id}</td>
            <td>{order.work}</td>
            <td>{order.phone}</td>
            <td>{order.email}</td>
            <td>{order.status}</td>
            <td>{order.comment}</td>
            {isAdmin && (
              <Fragment>
                <td>
                  <button
                    className="edit_order_button"
                    onClick={() => editOrderHandler(order)}
                  >
                    Edit order
                  </button>
                </td>
                <td style={{ borderStyle: "none" }}>
                  <button
                    className="delete_button"
                    onClick={() => deleteButtonHandler(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </Fragment>
            )}
          </tr>
        );
      });
    }
  };

  // const displayEditAndDeleteButton = () => {
  //   if (isAdmin) {
  //     return (
  //       <Fragment>
  //         <td>
  //           <button
  //             className="edit_order_button"
  //             onClick={() => editOrderHandler(order)}
  //           >
  //             Edit order
  //           </button>
  //         </td>
  //         <td style={{ borderStyle: "none" }}>
  //           <button
  //             className="delete_button"
  //             onClick={() => deleteButtonHandler(order.id)}
  //           >
  //             Delete
  //           </button>
  //         </td>
  //       </Fragment>
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  return (
    <div className="OrderDisplay">
      <div className="DisplayTitle">
        Order List Display
        <button
          className="orderdisplay_login_button"
          onClick={() => history.push("/login")}
        >
          Login
        </button>
        <button
          className="orderdisplay_neworder_button"
          onClick={() => history.push("/neworder")}
        >
          New Order
        </button>
        <button
          className="orderdisplay_contact_button"
          onClick={() => history.push("/contact")}
        >
          Contact
        </button>
      </div>
      <div className="DisplayIntroduction">
        This is the list of Orders in DB, Use HTTP GET Method
      </div>

      <div className="display_list">
        <div className="display_list_title">Order List</div>

        <table className="display_list_table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Work</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>{displayList()}</tbody>
        </table>
      </div>
      <div className={editorOpen ? "editor_box_open" : "editor_box_close"}>
        <OrderEditor
          open={editorOpen}
          setOpen={setEditorOpen}
          order={editorOrder}
          orders={orders}
          setOrders={setOrders}
          token={token}
        />
      </div>
    </div>
  );
}

export default OrderDisplay;
