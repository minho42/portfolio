const express = require("express");
const router = express.Router();
const axios = require("axios");

// router.post("/ing/balance", async (req, res) => {});

router.get("/ing/interestRate", async (req, res) => {
  try {
    const { data } = await axios(
      "https://www.ing.com.au/ReverseProxy/ProductService/V1/productservice.svc/json/interestrates/currenteffective"
    );
    const interestRate = data.InterestRates.find((x) => x.RateCode === "SM_WELCOME").Rate;
    res.send({ interestRate });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
