const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
var path = require("path");

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const routes = require("./routes");
app.use("/api", routes);

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(4000, () => console.log("My server is listening on port 4000."));
