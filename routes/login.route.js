require('dotenv').config();

const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const {makePasswordHashed} = require("../modules/becryption")

router.post('/login', async(req, res) => {
  const {nickname, password} = req.body;
  const user = await User.findOne({
    nickname
  })

  const {hashedpassword} = await makePasswordHashed(user.userId, password);

  if(!user || user.password !== hashedpassword){
    return (res.status(400).json({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요."
    }));
  }

  const token = jwt.sign({userId: user.userId}, process.env.SECRET_KEY);

  res.cookie("authorization", `Bearer ${token}`);
  res.status(200).json({
    token,
    success: true,
    message: "로그인에 성공했습니다."
  });
})

module.exports = router;