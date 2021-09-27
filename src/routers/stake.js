const axios = require("axios");
const express = require("express");
const router = express.Router();

const getStakeData = require("../stake");
const checkUser = require("../checkUser");
const stakeAuth = require("../middleware/stakeAuth");

router.get("/stake/check", stakeAuth, async (req, res) => {
  res.send({ token: req.token });
});

router.post("/stake/login", async (req, res) => {
  console.log("/stake/login: ");
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
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

router.post("/stake/logout", stakeAuth, async (req, res) => {
  try {
    res.clearCookie("token");
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

const fetchDividendYield = async (encodedName) => {
  try {
    const { data } = await axios(
      `https://global-prd-api.hellostake.com/api/instruments/getDWInstrumentStats/${encodedName}`
    );
    return data.fundamentalDataModel.dividendYield;
  } catch (error) {
    console.log(error);
    return -1;
  }
};

router.get("/stake/api/stake", stakeAuth, async (req, res) => {
  try {
    const token = req.cookies.token;
    const { equityPositions, equityValue } = await getStakeData(token);

    for (let position of equityPositions) {
      const dividendYield = await fetchDividendYield(position.encodedName);
      position["dividendYield"] = dividendYield;
    }

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
