require('dotenv').config();

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();
const port = process.env.SERVER_PORT;

const apiRouter = require("./routes")

const connect = require("./schemas");
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use("/api", [apiRouter])

app.get("/", (req, res) => {
  res.send('SPA-MALL-WITH-JWT');
})

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
})