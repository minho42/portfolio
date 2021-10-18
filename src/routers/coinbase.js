require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");

const getData = async (path) => {
  const apiKey = process.env.COINBASE_API_KEY;
  const apiSecret = process.env.COINBASE_API_SECRET;
  const body = "";
  const timestamp = Math.floor(Date.now() / 1000);
  const method = "GET";
  const message = timestamp + method + path + body;
  const signature = crypto.createHmac("sha256", apiSecret).update(message).digest("hex");

  const config = {
    method: method,
    baseURL: "https://api.coinbase.com/",
    url: path,
    headers: {
      "CB-ACCESS-KEY": apiKey,
      "CB-ACCESS-SIGN": signature,
      "CB-ACCESS-TIMESTAMP": timestamp,
      "CB-VERSION": "2021-09-29",
    },
  };

  const { data } = await axios(config);
  return data;
};

router.get("/coinbase/exchangeRates", async (req, res) => {
  try {
    const { data } = await getData("/v2/exchange-rates?currency=AUD");
    res.send({ data });
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/coinbase/accounts", async (req, res) => {
  try {
    const { data } = await getData("/v2/accounts");
    const accounts = data.filter((account) => {
      return account.balance.amount > 0;
    });

    res.send({ accounts });
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
