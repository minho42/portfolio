const express = require("express");
const router = express.Router();

const { getEquityPositions, getTransactionHistory } = require("../stake");
const checkUser = require("../checkUser");
const stakeAuth = require("../middleware/stakeAuth");

router.get("/stake/check", stakeAuth, async (req, res) => {
  res.send({ stakeToken: req.stakeToken });
});

router.post("/stake/login", async (req, res) => {
  console.log("/stake/login: ");
  try {
    const stakeToken = req.body.stakeToken;
    const isTokenValid = await checkUser(stakeToken);
    if (!isTokenValid) {
      throw new Error("stakeToken not valid");
    }
    res.cookie("stakeToken", stakeToken, {
      httpOnly: true,
    });
    // console.log(req.cookies);
    res.send({ stakeToken });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

router.post("/stake/logout", stakeAuth, async (req, res) => {
  try {
    res.clearCookie("stakeToken");
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get("/stake/api/transactionHistory", stakeAuth, async (req, res) => {
  try {
    const stakeToken = req.cookies.stakeToken;
    const data = await getTransactionHistory(stakeToken);

    res.send({
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

router.get("/stake/api/equityPositions", stakeAuth, async (req, res) => {
  try {
    const stakeToken = req.cookies.stakeToken;
    const { equityPositions, equityValue } = await getEquityPositions(stakeToken);

    res.send({
      data: {
        equityPositions,
        equityValue,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

module.exports = router;
