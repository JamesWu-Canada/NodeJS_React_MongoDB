const express = require("express");
const router = express.Router();

const {
  getRoot,
  getPublic,
  getOrders,
  getOrderByID,
  getOrdersByEmail,
  postRoot,
  postPublic,
  postOrder,
  postOrders,
  putRoot,
  putPublic,
  deleteRoot,
  deletePublic,
  deleteOrder,
  deleteOrders,
  putOrder,
  putOrders,
  getUsers,
  getUserByEmail,
  signUpUser,
  deleteOrderByID,
  createToken,
  emailController,
} = require("./controller");

router.get("/", getRoot);
router.get("/public", getPublic);
router.get("/orders", getOrders);
router.get("/order/:id", getOrderByID);
router.get("/orders/:email", getOrdersByEmail);
router.post("/", postRoot);
router.post("/public", postPublic);
router.post("/order", postOrder);
router.post("/orders", postOrders);
router.put("/", putRoot);
router.put("/public", putPublic);
router.put("/order", putOrder);
router.put("/orders", putOrders);
router.delete("/", deleteRoot);
router.delete("/public", deletePublic);
router.delete("/order", deleteOrder);
router.delete("/order/:id", deleteOrderByID);
router.delete("/orders", deleteOrders);

router.get("/users", getUsers);
router.get("/user/:email", getUserByEmail);
router.post("/user", signUpUser);

router.post("/token", createToken);

router.post("/email", emailController);

//app.use(express.static(path.join(__dirname, 'frontend/build')));
// router.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
// });

module.exports = router;
