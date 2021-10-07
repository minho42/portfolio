require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const puppeteer = require("puppeteer");
const { login } = require("ing-au-login");

const getIngBalance = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      // args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.resourceType() == "stylesheet" || req.resourceType() == "font") {
        req.abort();
      } else {
        req.continue();
      }
    });
    const token = await login(page, process.env.ING_CLIENT_NUMBER, process.env.ING_ACCESS_CODE);
    console.log(`ING token: ${token.slice(0, 10)}...${token.slice(token.length - 10, token.length)}`);

    await page.waitForSelector(
      ".uia-total-available-balance"
      // { timeout: 4000 }
    );
    const balance = await page.evaluate(() => {
      return document
        .querySelector(".uia-total-available-balance > span")
        .textContent.replace("$", "")
        .replace(",", "");
    });
    const name = await page.evaluate(() => {
      return document.querySelector("#titleWrapper h1").textContent.replace("Hi ", "").replace(",", "");
    });

    await browser.close();
    return { balance, name };
  } catch (error) {
    console.log(error);
    await browser.close();
    return 0;
  }
};

router.get("/ing/balance", async (req, res) => {
  const data = await getIngBalance();
  res.send({ data });
});

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
