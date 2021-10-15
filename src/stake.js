const axios = require("axios");

const getEquityPositions = async (token) => {
  if (!token) {
    throw new Error("getEquityPositions: !token");
  }
  const config = {
    method: "get",
    url: "https://global-prd-api.hellostake.com/api/users/accounts/v2/equityPositions",
    headers: {
      authority: "global-prd-api.hellostake.com",
      pragma: "no-cache",
      "cache-control": "no-cache",
      "sec-ch-ua": '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
      accept: "application/json",
      "stake-session-token": token,
      "sec-ch-ua-mobile": "?0",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
      "x-server-select": "AUS",
      "sec-ch-ua-platform": '"macOS"',
      origin: "https://trading.hellostake.com",
      "sec-fetch-site": "same-site",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      referer: "https://trading.hellostake.com/",
      "accept-language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    },
  };
  try {
    const { data } = await axios(config);

    console.log("getEquityPositions: ");
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getTransactionHistory = async (token) => {
  if (!token) {
    throw new Error("getTransactionHistory: !token");
  }

  const configData =
    '{"direction":"prev","from":"2020-10-16T12:54:42.216Z","to":"2021-10-16T12:54:42.216Z","limit":1000,"offset":null}';

  const config = {
    method: "post",
    url: "https://global-prd-api.hellostake.com/api/users/accounts/transactionHistory",
    headers: {
      authority: "global-prd-api.hellostake.com",
      pragma: "no-cache",
      "cache-control": "no-cache",
      "sec-ch-ua": '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
      "content-type": "application/json;charset=UTF-8",
      accept: "application/json",
      "stake-session-token": token,
      "x-server-select": "AUS",
      "sec-ch-ua-platform": '"macOS"',
      origin: "https://trading.hellostake.com",
      "sec-fetch-site": "same-site",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      referer: "https://trading.hellostake.com/",
      "accept-language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    },
    data: configData,
  };

  try {
    const { data } = await axios(config);

    console.log("getTransactionHistory: ");
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getEquityPositions, getTransactionHistory };
