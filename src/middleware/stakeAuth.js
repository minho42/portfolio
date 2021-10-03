require("dotenv").config();
const checkUser = require("../checkUser.js");

const stakeAuth = async (req, res, next) => {
  try {
    const stakeToken = req.cookies.stakeToken;
    if (!stakeToken) {
      throw new Error("stakeAuth: !stakeToken");
    }
    const isTokenValid = await checkUser(stakeToken);
    if (!isTokenValid) {
      throw new Error("Token not valid");
    }
    // console.log(`auth.stakeToken: ${stakeToken}`);
    req.stakeToken = stakeToken;

    next();
  } catch (error) {
    console.log(error);
    res.clearCookie("stakeToken");
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = stakeAuth;
