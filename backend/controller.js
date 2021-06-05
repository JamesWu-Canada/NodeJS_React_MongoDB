const { merge } = require("./routes");
const { mongoConnect } = require("./mongoDBconnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");

const {
  fetchAllOrders,
  fetchOrderByID,
  fetchOrdersByEmail,
  addOrder,
  addOrders,
  updateOrder,
  updateOrders,
  removeOrder,
  removeOrderByID,
  removeOrders,
  fetchAllUsers,
  fetchUserByEmail,
  addUser,
} = require("./mongoMethods");

const orders = [
  {
    id: 1,
    work: "painting bathroom",
    phone: "438 929 0303",
    email: "mr.jamesy.wu@gmail.com",
  },
  {
    id: 2,
    work: "painting kitchen",
    phone: "514-572-7897",
    email: "mr.gouping.wu@gmail.com",
  },
  {
    id: 3,
    work: "painting living room",
    phone: "5149620423",
    email: "ginawu02@mail.mcgill.ca",
  },
];

const phone1 = /\d{3}\s{1,}\d{3}\s{1,}\d{4}/;
const phone2 = /\d{3}-\d{3}-\d{4}/;
const phone3 = /^\d{10}$/;
const email = /^([a-z\d\.-]+)@([a-z\d\-]+)\.([a-z]{2,6})(\.[a-z]{2,5})?$/;

mongoConnect();

exports.getRoot = async (req, res) => {
  res.send("you have reached Student Painting");
};

exports.getPublic = async (req, res) => {
  const company = {
    name: "StudentPainting",
    contact: "438-929-0303",
  };
  res.status(200).json(company);
};

exports.getOrders = async (req, res) => {
  const authHeader = req.headers.authorization;
  //console.log(req.headers);
  const secret = process.env.JWT_SECRET;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("token:::" + token);
    if (token == null) {
      res.status(200).json({ message: "token missing" });
      return;
    }

    jwt.verify(token, secret, async (err, payload) => {
      if (err) {
        res.status(200).json({ message: "token invalid" });
        return;
      } else {
        const { iat } = payload;
        const current = moment().unix();
        if (current > 60 * 60 * 24 + iat) {
          console.log("token expired");
          res.status(200).send({ message: "token older than 24 hour" });
          return;
        }
      }
      let mongoOrders = await fetchAllOrders();
      console.log(mongoOrders);
      //res.status(200).json(orders);
      res.status(200).json(mongoOrders);
    });
  } else {
    res.status(200).json({ message: "token missing" });
    return;
  }
};

exports.getOrderByID = async (req, res) => {
  console.log("running controller:getOrderByID");
  // console.log(req)
  // console.log(req.params)
  const id = req.params.id;
  console.log(`order Id= ${id}`);

  let mongoOrder = await fetchOrderByID(id);
  if (mongoOrder && mongoOrder.length === 0) {
    res.status(404).send({ reason: "id not found" });
    return;
  }
  res.status(200).json(mongoOrder);
};

exports.getOrdersByEmail = async (req, res) => {
  console.log("running controller:getOrdersByEmail");
  const authHeader = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    //console.log(token);
    if (token == null) {
      res.status(200).json({ message: "token missing" });
      return;
    }

    jwt.verify(token, secret, async (err, payload) => {
      if (err) {
        res.status(200).json({ message: "token invalid" });
        return;
      } else {
        const { iat } = payload;
        const current = moment().unix();
        if (current > 60 * 60 * 24 + iat) {
          console.log("token expired");
          res.status(200).send({ message: "token older than 24 hour" });
          return;
        }
      }
      const email = req.params.email;
      console.log(`email= ${email}`);

      let mongoOrders = await fetchOrdersByEmail(email);
      // if (mongoOrders && mongoOrders.length === 0) {
      //   res.status(404).send({ reason: "email not found" });
      //   return;
      // }
      res.status(200).json(mongoOrders);
    });
  } else {
    res.status(200).json({ message: "token missing" });
    return;
  }
};

exports.postRoot = async (req, res) => {
  res.send('it is a POST method, path is "/"');
};

exports.postPublic = async (req, res) => {
  res.send('it is a POST method, path is "/public"');
};

exports.postOrder = async (req, res) => {
  //console.log(orders)
  //console.log(req.body)

  if (Array.isArray(req.body)) {
    res.status(400).send({ reason: "Can only post one object at a time" });
    return;
  }

  // console.log(phone1.test(req.body.phone))
  // console.log(phone2.test(req.body.phone))
  // console.log(phone3.test(req.body.phone))
  //console.log("Is phone number valid?: " + (phone1.test(req.body.phone) || phone2.test(req.body.phone) || phone3.test(req.body.phone)))
  //console.log("Is email address valid?: " + email.test(req.body.email))

  //if((phone1.test(req.body.phone) || phone2.test(req.body.phone))
  //&& email.test(req.body.email)){
  //orders.push(req.body);
  //res.status(200).json(orders);
  //} else
  if (
    !(
      phone1.test(req.body.phone) ||
      phone2.test(req.body.phone) ||
      phone3.test(req.body.phone)
    )
  ) {
    res.status(400).send({ reason: "Invalid phone number format" });
    return;
  } else if (!email.test(req.body.email)) {
    res.status(400).send({ reason: "Invalid email address format" });
    return;
  }

  //console.log(orders)
  let result = await addOrder(req.body);
  //console.log(result)
  if (result.status === false) {
    res.status(400).send({ reason: result.reason });
    return;
  } else {
    res.status(200).send({ reason: result.reason });
    return;
  }
  //console.log("---------------------------------------------------------------------------------")
};

exports.postOrders = async (req, res) => {
  if (!Array.isArray(req.body)) {
    res.status(400).send({ reason: "Must post an array of orders" });
    return;
  }

  for (i = 0; i < req.body.length; i++) {
    if (
      !(
        phone1.test(req.body[i].phone) ||
        phone2.test(req.body[i].phone) ||
        phone3.test(req.body[i].phone)
      )
    ) {
      res.status(400).send({ reason: "Invalid phone number format" });
      return;
    } else if (!email.test(req.body[i].email)) {
      res.status(400).send({ reason: "Invalid email address format" });
      return;
    }
  }

  let result = await addOrders(req.body);
  console.log(result.orderStatus);
  if (result.falseStatus.length != 0) {
    res
      .status(400)
      .send({ reason: "id already existed or order creation failed" });
  } else {
    res.status(200).send({ reason: "all orders created" });
  }
};

exports.putRoot = async (req, res) => {
  res.send('it is a PUT method, path is "/"');
};

exports.putPublic = async (req, res) => {
  res.send('it is a PUT method, path is "/public"');
};

exports.putOrder = async (req, res) => {
  if (Array.isArray(req.body)) {
    res.status(400).send({ reason: "Can only post one object at a time" });
    return;
  }

  console.log(orders);
  console.log(req.body);

  if (
    !(
      phone1.test(req.body.phone) ||
      phone2.test(req.body.phone) ||
      phone3.test(req.body.phone)
    )
  ) {
    res.status(400).send({ reason: "Invalid phone number format" });
    return;
  } else if (!email.test(req.body.email)) {
    res.status(400).send({ reason: "Invalid email address format" });
    return;
  }
  const authHeader = req.headers.authorization;
  //console.log(req.headers);
  const secret = process.env.JWT_SECRET;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    //console.log(token);
    if (token == null) {
      res.status(200).json({ message: "token missing" });
      return;
    }

    jwt.verify(token, secret, async (err, payload) => {
      if (err) {
        res.status(200).json({ message: "token invalid" });
        return;
      }
      let result = await updateOrder(req.body);
      if (result.status === false) {
        res.status(400).send({ reason: result.reason });
        return;
      } else {
        res.status(200).send({ reason: result.reason });
        return;
      }
    });
  } else {
    res.status(200).json({ message: "token missing" });
    return;
  }
  // for (i = 0; i < orders.length; i++) {
  //   if(req.body.id===orders[i].id){
  //     orders[i].work = req.body.work
  //     orders[i].email = req.body.email
  //     orders[i].phone = req.body.phone
  //     res.status(200).json(orders);
  //     console.log(orders);
  //     console.log("---------------------------------------------------------------------------------")
  //     return;
  //   }
  // }

  // orders.push(req.body);
  // res.status(200).json(orders);
  // console.log(orders);
  // console.log("---------------------------------------------------------------------------------")
};

exports.putOrders = async (req, res) => {
  if (!Array.isArray(req.body)) {
    res.status(400).send({ reason: "Must post an array of orders" });
    return;
  }
  for (i = 0; i < req.body.length; i++) {
    if (
      !(
        phone1.test(req.body[i].phone) ||
        phone2.test(req.body[i].phone) ||
        phone3.test(req.body[i].phone)
      )
    ) {
      res.status(400).send({ reason: "Invalid phone number format" });
      return;
    } else if (!email.test(req.body[i].email)) {
      res.status(400).send({ reason: "Invalid email address format" });
      return;
    }
  }
  let result = await updateOrders(req.body);
  console.log(result.orderStatus);
  //console.log(result.falseStatus)
  if (result.falseStatus.length != 0) {
    res.status(400).send({ reason: "order update failed" });
  } else {
    res.status(200).send({ reason: "all orders updated/added" });
  }
};

exports.deleteRoot = async (req, res) => {
  res.send('it is a DELETE method, path is "/"');
};

exports.deletePublic = async (req, res) => {
  res.send('it is a DELETE method, path is "/public"');
};

exports.deleteOrder = async (req, res) => {
  // console.log(orders)
  // console.log(req.body)
  // console.log("Is phone number valid?: " + (phone1.test(req.body.phone) || phone2.test(req.body.phone)))
  // console.log("Is email address valid?: " + email.test(req.body.email))
  if (Array.isArray(req.body)) {
    res.status(400).send({ reason: "Can only delete one object at a time" });
    return;
  }

  if (
    !(
      phone1.test(req.body.phone) ||
      phone2.test(req.body.phone) ||
      phone3.test(req.body.phone)
    )
  ) {
    res.status(400).send({ reason: "Invalid phone number format" });
    return;
  } else if (!email.test(req.body.email)) {
    res.status(400).send({ reason: "Invalid email address format" });
    return;
  }
  const authHeader = req.headers.authorization;
  //console.log(req.headers);
  const secret = process.env.JWT_SECRET;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    //console.log(token);
    if (token == null) {
      res.status(200).json({ message: "token missing" });
      return;
    }

    jwt.verify(token, secret, async (err, payload) => {
      if (err) {
        res.status(200).json({ message: "token invalid" });
        return;
      }
      let result = await removeOrder(req.body);
      if (result.status === false) {
        res.status(400).send({ reason: result.reason });
        return;
      } else {
        res.status(200).send({ reason: result.reason });
        return;
      }
    });
  } else {
    res.status(200).json({ message: "token missing" });
    return;
  }

  // for (i = 0; i < orders.length; i++) {
  //   if(req.body.id===orders[i].id ){
  //     orders.splice(i, 1);
  //     res.status(200).json(orders);
  //     console.log(orders);
  //     console.log("---------------------------------------------------------------------------------")
  //     return;
  //   }
  // }

  // res.status(404).send({reason: "the order id not found"});
};

exports.deleteOrderByID = async (req, res) => {
  const id = req.params.id;
  console.log(`order Id= ${id}`);

  let result = await removeOrderByID(id);
  if (result.status === false) {
    res.status(400).send({ reason: result.reason });
    return;
  } else {
    res.status(200).send({ reason: result.reason });
    return;
  }
};

exports.deleteOrders = async (req, res) => {
  if (!Array.isArray(req.body)) {
    res.status(400).send({ reason: "Must post an array of orders" });
    return;
  }
  for (i = 0; i < req.body.length; i++) {
    if (
      !(
        phone1.test(req.body[i].phone) ||
        phone2.test(req.body[i].phone) ||
        phone3.test(req.body[i].phone)
      )
    ) {
      res.status(400).send({ reason: "Invalid phone number format" });
      return;
    } else if (!email.test(req.body[i].email)) {
      res.status(400).send({ reason: "Invalid email address format" });
      return;
    }
  }
  let result = await removeOrders(req.body);
  console.log(result.orderStatus);
  //console.log(result.falseStatus)
  if (result.falseStatus.length != 0) {
    res.status(400).send({ reason: "order not found/delete failed" });
  } else {
    res.status(200).send({ reason: "all orders deleted" });
  }
};

//------------------ User collection methods--------------------
exports.getUsers = async (req, res) => {
  let mongoUsers = await fetchAllUsers();
  console.log(mongoUsers);
  res.status(200).json(mongoUsers);
};

exports.getUserByEmail = async (req, res) => {
  console.log("running controller:getUserByEmail");
  // console.log(req)
  // console.log(req.params)
  const email = req.params.email;
  console.log(`user email= ${email}`);

  let mongoUser = await fetchUserByEmail(email);
  if (mongoUser && mongoUser.length === 0) {
    res.status(404).send({ reason: "user not found" });
    return;
  }
  res.status(200).json(mongoUser);
};

exports.signUpUser = async (req, res) => {
  if (Array.isArray(req.body)) {
    res.status(400).send({ reason: "Can only post one object at a time" });
    return;
  }

  if (!email.test(req.body.email)) {
    res.status(400).send({ reason: "Invalid email address format" });
    return;
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hashedPassword;

  const secret = process.env.JWT_SECRET;
  const payload = {
    email: req.body.email,
  };
  const token = jwt.sign(payload, secret);
  //console.log(token);

  let result = await addUser(req.body);

  if (result.status === false) {
    res.status(400).send({ reason: result.reason });
    return;
  } else {
    res.status(200).send({ reason: result.reason, token: token });
    return;
  }
};

exports.createToken = async (req, res) => {
  const secret = process.env.JWT_SECRET;
  const payload = {
    email: req.body.email,
  };
  //console.log(payload);
  const token = jwt.sign(payload, secret);

  res.status(200).send({ token: token });
};

exports.emailController = async (req, res) => {
  console.log("email_controller");

  console.log(req.body);
  if (req.body) {
    const emailMsg = `from: ${req.body.email}, subject: ${req.body.subject}, message: ${req.body.message}`;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: "james.wu4@mail.mcgill.ca",
      from: "mr.jamesy.wu@gmail.com",
      subject: "James Wu Painting",
      text: emailMsg,
      html: `<strong>${emailMsg}</strong>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent successfully");
        res.status(200).json({ message: "Email successfully sent." });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({
          message: "Email failed.",
        });
      });
  }
};
