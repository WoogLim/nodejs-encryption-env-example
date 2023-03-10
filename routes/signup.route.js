const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const {createHashedPassword} = require("../modules/encryption")

router.post('/signup', async(req, res) => {
  const {nickname, password, confirm} = req.body;

  // 닉네임 Validation
  if (!/^[a-zA-Z0-9]{3,}$/.test(nickname)) {
    return (res.status(400).json({
      success: false,
      errorMessage:"최소 3자 이상의 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 를 포함한 닉네임을 입력해주세요."
    }))
  }

  // 패스워드, 패스워드 확인 성공
  if(password !== confirm){
    return (res.status(400).json({
      success: false,
      errorMessage:"패스워드가 일치하지 않습니다."
    }));
  }

  // 비밀번호 Validation
  if (!/^.{4,}$/.test(password) || password.includes(nickname)) {
    return (res.status(400).json({
      success: false,
      errorMessage:"최소 4자 이상의 닉네임과 같은 문자가 포함되지 않는 비밀번호를 입력해주세요."
    }))
  }

  // 중복된 닉네임이 존재하는 경우 
  const user = await User.findOne({
    nickname
  })

  if(user){
    return (res.status(400).json({
      success: false,
      errorMessage:"중복된 닉네임이 존재합니다."
    }));
  }

  const {hashedPassword, salt} = await createHashedPassword(password);

  try{
    await User.create({
      nickname
      , password: hashedPassword
      , salt
    })

    return res.status(200).json({
      success: true,
      message: "회원가입에 성공했습니다."
    })
  }catch(err){
    console.error(err)
  }
  
})

module.exports = router;