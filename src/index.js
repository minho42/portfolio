require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const usdToAud = require("./utils");
const stakeRouter = require("./routers/stake");
const coinbaseRouter = require("./routers/coinbase");
const ingRouter = require("./routers/ing");

const app = express();
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(stakeRouter);
app.use(coinbaseRouter);
app.use(ingRouter);

app.get("", (req, res) => {
  res.send({
    data: "It's working!",
  });
});

app.get("/currency/usdToAud", async (req, res) => {
  const rate = await usdToAud();
  res.send({ rate });
});

app.get("*", (req, res) => {
  res.status(404).send({
    error: "404 Not Found",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
