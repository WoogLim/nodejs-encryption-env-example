require('dotenv').config();
const mongoose = require("mongoose");

const connect = () => {
  // 커넥션
  mongoose
    .connect(process.env.DB_CONNECTION)
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  // 커넥션 과정 에러 발생 시, 에러 발생
  console.error("mongoDB connection error!", err);
})

module.exports = connect;