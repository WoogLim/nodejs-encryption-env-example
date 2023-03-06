require('dotenv').config();

const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const { authorization } = req.cookies;
  
  const [authType, authToken] = (authorization ?? "").split(" ");

  if(authType !== 'Bearer' || !authToken){
    return (res.status(403).json({
      errorMessage: "로그인 후에 이용할 수 있는 기능입니다."
    }));
  }

  try{
    const {userId} = jwt.verify(authToken, process.env.SECRET_KEY);
  
    const user = await User.findOne({_id: userId})

    res.locals.user = user;

    next();
  } catch(err){
    // 사용자 인증에 실패한 이유
    console.error(err);

    return (res.status(403).json({
      errorMessage: "전달된 쿠키에서 오류가 발생하였습니다."
    }))
  }
}