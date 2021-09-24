const axios = require("axios");

const getStakeData = async (token) => {
  if (!token) {
    throw new Error("getStakeData: !token");
  }
  const config = {
    method: "get",
    url: "https://global-prd-api.hellostake.com/api/users/accounts/v2/equityPositions/pricesOnly",
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
    // symbol
    // openQty
    // marketValue
    // unrealizedDayPL
    // unrealizedPL

    console.log("getStakeData: ");
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

module.exports = getStakeData;
