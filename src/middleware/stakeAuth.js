require("dotenv").config();
const checkUser = require("../checkUser.js");

const stakeAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("stakeAuth: !token");
    }
    const isTokenValid = await checkUser(token);
    if (!isTokenValid) {
      throw new Error("Token not valid");
    }
    // console.log(`auth.token: ${token}`);
    req.token = token;

    next();
  } catch (error) {
    console.log(error);
    res.clearCookie("token");
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = stakeAuth;
