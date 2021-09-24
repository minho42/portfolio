const express = require("express");
const router = express.Router();

const getStakeData = require("../stake");
const checkUser = require("../checkUser");
const stakeAuth = require("../middleware/stakeAuth");

router.get("/stake/users/check", stakeAuth, async (req, res) => {
  res.send({ token: req.token });
});

router.post("/stake/login", async (req, res) => {
  try {
    const token = req.body.token;
    const isTokenValid = await checkUser(token);
    if (!isTokenValid) {
      throw new Error("Token not valid");
    }
    res.cookie("token", token, {
      httpOnly: true,
    });
    // console.log(req.cookies);
    res.send({ token });
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.get("/stake/api/stake", stakeAuth, async (req, res) => {
  try {
    // const { equityPositions, equityValue } = await getStakeData();
    // res.send({ equityPositions, equityValue });
    const token = req.cookies.token;
    const data = await getStakeData(token);
    res.send({ data });
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

module.exports = router;
