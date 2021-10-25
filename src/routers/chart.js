const express = require("express");
const router = express.Router();
const axios = require("axios");

const fetchChartData = async (symbol) => {
  const period2 = Math.round(new Date().getTime() / 1000);
  const config = {
    method: "get",
    url: `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?symbol=${symbol}&period1=1238504400&period2=${period2}&useYfid=true&interval=1d&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-AU&region=AU&crumb=IhoCryrfgf0&corsDomain=au.finance.yahoo.com`,
    headers: {
      authority: "query1.finance.yahoo.com",
      pragma: "no-cache",
      "cache-control": "no-cache",
      "sec-ch-ua": '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
      "sec-ch-ua-platform": '"macOS"',
      accept: "*/*",
      origin: "https://au.finance.yahoo.com",
      "sec-fetch-site": "same-site",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      referer: `https://au.finance.yahoo.com/quote/${symbol}/chart?p=${symbol}`,
      "accept-language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    },
  };
  try {
    const { data } = await axios(config);
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

router.get("/chart/data/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    if (!symbol || symbol.length < 1) {
      throw new Error("!symbol");
    }
    const data = await fetchChartData(symbol);
    if (!data || data.chart.error) {
      throw new Error("fetchChartData failed");
    }
    res.send({
      data: {
        timestamp: data.chart.result[0].timestamp,
        quote: data.chart.result[0].indicators.quote[0].close,
      },
    });
    // res.send({ data });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

module.exports = router;
