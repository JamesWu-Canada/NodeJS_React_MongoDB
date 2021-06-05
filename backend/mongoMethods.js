const { Order } = require("./model");
const { User } = require("./model");

exports.fetchAllOrders = async () => {
  console.log("fetchAllOrders");
  try {
    const orders = await Order.find({});
    console.log("fetchAllOrders length", orders.length);
    return orders;
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.fetchOrderByID = async (idOfWantedOrder) => {
  console.log("fetchOrderByID");
  try {
    const order = await Order.find({ id: idOfWantedOrder });
    console.log(order);
    return order;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.fetchOrdersByEmail = async (emailOfWantedOrders) => {
  console.log("fetchOrdersByEmail");
  try {
    const orders = await Order.find({ email: emailOfWantedOrders });
    console.log(orders);
    return orders;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.addOrder = async (order) => {
  //console.log ("addOrder")
  //console.log(order)
  const orderId = order.id;

  try {
    let found = await Order.findOne({ id: orderId });
    //const order = await Order.find({id: idOfWantedOrder});
    // console.log(found)
    if (found === null) {
      console.log(`document with id = ${orderId} not found`);
      //let doc = await Order.create(order)
      await Order.create(order);
      //console.log (doc)
      return { status: true, reason: "document created" };
    } else {
      return { status: false, reason: "id already existed" };
    }
  } catch (error) {
    //console.log(error)
    return { status: false, reason: "order creation failed" };
  }
};

exports.addOrders = async (orders) => {
  // console.log ("addOrders")
  let orderStatuses = [];
  let falseStatuses = [];

  for (i = 0; i < orders.length; i++) {
    orderStatuses[i] = await this.addOrder(orders[i]);

    if (!orderStatuses[i].status) {
      falseStatuses.push(orders[i]);
    }
  }

  return { orderStatus: orderStatuses, falseStatus: falseStatuses };
};

exports.updateOrder = async (order) => {
  const orderId = order.id;

  try {
    let found = await Order.findOneAndUpdate(
      { id: orderId },
      {
        work: order.work,
        phone: order.phone,
        email: order.email,
        status: order.status,
        comment: order.comment,
      }
    );
    //const order = await Order.find({id: idOfWantedOrder});
    // console.log(found)
    if (found === null) {
      console.log(`document with id = ${orderId} not found`);
      //let doc = await Order.create(order)
      await Order.create(order);
      //console.log (doc)
      return { status: true, reason: "document created" };
    } else {
      return { status: true, reason: "document updated" };
    }
  } catch (error) {
    console.log(error);
    return { status: false, reason: "order update/creation failed" };
  }
};

exports.updateOrders = async (orders) => {
  // console.log ("addOrders")
  let orderStatuses = [];
  let falseStatuses = [];

  for (i = 0; i < orders.length; i++) {
    orderStatuses[i] = await this.updateOrder(orders[i]);
    if (!orderStatuses[i].status) {
      falseStatuses.push(orders[i]);
    }
  }

  return { orderStatus: orderStatuses, falseStatus: falseStatuses };
};

exports.removeOrder = async (order) => {
  const orderId = order.id;

  try {
    let found = await Order.findOneAndDelete({ id: orderId });
    if (found === null) {
      console.log(`document with id = ${orderId} not found`);
      return { status: false, reason: "document not found" };
    } else {
      return { status: true, reason: "document deleted" };
    }
  } catch (error) {
    return { status: false, reason: "deletion failed" };
  }
};

exports.removeOrderByID = async (ID) => {
  try {
    let found = await Order.findOneAndDelete({ id: ID });
    if (found === null) {
      console.log(`document with id = ${orderId} not found`);
      return { status: false, reason: "document not found" };
    } else {
      return { status: true, reason: "document deleted" };
    }
  } catch (error) {
    return { status: false, reason: "deletion failed" };
  }
};

exports.removeOrders = async (orders) => {
  // console.log ("addOrders")
  let orderStatuses = [];
  let falseStatuses = [];

  for (i = 0; i < orders.length; i++) {
    orderStatuses[i] = await this.removeOrder(orders[i]);
    if (!orderStatuses[i].status) {
      falseStatuses.push(orders[i]);
    }
  }

  return { orderStatus: orderStatuses, falseStatus: falseStatuses };
};

/*exports.saveOrder = async (data) => {
      console.log(`fetchMongo:saveOrder() userName = ${data.userName}`); 
      //console.log (data)
      try {     
            let doc = await Order.findOneAndUpdate({userName: data.userName, status: "pending"}, data, {new: true, useFindAndModify:false, overwrite: true, upsert: true})
            //console.log(doc)
            return doc
      } catch (error) {
            console.log(error)
            return false
      }

}

exports.fetchOrderByName = async (name) => {
      console.log (`fetchMongo:fetchOrderByName name = ${name}`)
      
      try { 
            const order = await Order.findOne({"userName": name, status:"pending"});
            //console.log(order)
            return order
      } catch (error) {
            console.log(error)
            return null
      }
  }*/

exports.fetchAllUsers = async () => {
  console.log("fetchAllUsers");
  try {
    const users = await User.find({});
    console.log("fetchAllUsers length", users.length);
    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.fetchUserByEmail = async (emailOfWantedUser) => {
  console.log("fetchUserByEmail");
  try {
    const user = await User.find({ email: emailOfWantedUser });
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.addUser = async (user) => {
  //console.log ("addOrder")
  //console.log(order)
  const userEmail = user.email;

  try {
    let found = await User.findOne({ email: userEmail });
    //const order = await Order.find({id: idOfWantedOrder});
    // console.log(found)
    if (found === null) {
      console.log(`document with email = ${userEmail} not found`);
      //let doc = await Order.create(order)
      await User.create(user);
      //console.log (doc)
      return { status: true, reason: "user created" };
    } else {
      return { status: false, reason: "email already existed" };
    }
  } catch (error) {
    //console.log(error)
    return { status: false, reason: "user creation failed" };
  }
};
