require('dotenv').config();
const crypto = require("crypto")
const User = require("../schemas/user");

// 기존 DB에 저장되어있는 salt와 같이 다시 해싱
const makePasswordHashed = (userId, password) =>
new Promise(async (resolve, reject) => {
    const user = await User.findById({_id: userId}).exec();

    crypto.pbkdf2(password, user.salt, Number(process.env.SALT_ITERATIONS_CNT), Number(process.env.SALT_SET_BYTE), process.env.ENCRYPT_SET_ALGORITHM, (err, key) => {
        if (err) reject(err);
        resolve({hashedpassword: key.toString('base64')});
    });
});

module.exports = { makePasswordHashed };