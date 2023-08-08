require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.SERVER_PORT || 3000;
const productRouter = require("./routes/product.route");
const userRouter = require("./routes/user.route");
const { sequelize } = require("./models");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

sequelize
  .authenticate()
  .then(function (error) {
    console.log("database connected successfuly");
  })
  .catch(function (error) {
    console.log("unable to connect to databse" + error);
  });

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.use("/api/products", productRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
