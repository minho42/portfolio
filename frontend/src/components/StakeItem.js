import { useEffect, useState } from "react";
import { formatDistance } from "date-fns";

const StakeItem = ({
  data: { urlImage, symbol, openQty, marketValue, unrealizedDayPL, unrealizedPL, encodedName },
  isPositive,
  showValueWithSign,
}) => {
  const [dividendYield, setDividendYield] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [showRatings, setShowRatings] = useState(false);
  const [buyCount, setBuyCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);
  const [holdCount, setHoldCount] = useState(0);

  const isRatingBuy = (rating) => {
    const buys = ["buy", "outperform", "overweight", "positive"];
    return buys.some((b) => rating.toLowerCase().includes(b.toLowerCase()));
  };

  const isRatingSell = (rating) => {
    const buys = ["sell", "underperform", "underweight"];
    return buys.some((b) => rating.toLowerCase().includes(b.toLowerCase()));
  };

  const fetchDividendYield = async () => {
    try {
      const res = await fetch(
        `https://global-prd-api.hellostake.com/api/instruments/getDWInstrumentStats/${encodedName}`
      );
      const data = await res.json();
      return data.fundamentalDataModel.dividendYield;
    } catch (error) {
      console.log(error);
      return -1;
    }
  };

  const countBuySell = (ratings) => {
    let buy = 0;
    let sell = 0;
    let hold = 0;
    ratings.map((r) => {
      if (isRatingBuy(r.rating_current)) {
        buy++;
      } else if (isRatingSell(r.rating_current)) {
        sell++;
      } else {
        hold++;
      }
    });
    setBuyCount(buy);
    setSellCount(sell);
    setHoldCount(hold);
  };

  const fetchRatings = async () => {
    try {
      const res = await fetch(
        `https://global-prd-api.hellostake.com/api/data/calendar/ratings?tickers=${symbol}&pageSize=50`
      );
      const { ratings } = await res.json();
      // setRatings(ratings);
      setRatings(ratings.slice(0, 10));
      countBuySell(ratings.slice(0, 10));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    const d = await fetchDividendYield();
    setDividendYield(d);

    fetchRatings();
  }, []);

  return (
    <>
      <tr
        onClick={() => {
          setShowRatings(!showRatings);
        }}
        className="border-b border-gray-300 text-center text-sm"
      >
        <td className="py-1">{symbol}</td>
        <td className="py-1">{Number.parseFloat(Number.parseFloat(openQty).toFixed(2)).toLocaleString()}</td>
        <td className={`py-1 ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
          ${Number.parseFloat(marketValue).toLocaleString()}
        </td>
        <td className={`py-1 ${isPositive(unrealizedDayPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedDayPL)}
        </td>
        <td className={`py-1 ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedPL)}
        </td>
        <td>{dividendYield > 0 ? `${Number.parseFloat(dividendYield).toFixed(2)}%` : "-"}</td>

        <td className="flex items-center justify-start space-x-1">
          {buyCount > 0 && (
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {buyCount}
            </div>
          )}

          {sellCount > 0 && (
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              {sellCount}
            </div>
          )}

          {holdCount > 0 && (
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z"
                  clipRule="evenodd"
                />
              </svg>
              {holdCount}
            </div>
          )}
        </td>
      </tr>

      {showRatings && (
        <tr>
          <td className="border-2 border-gray-500 p-2 shadow-xl" colSpan="100%">
            {ratings &&
              ratings.map((r) => {
                return (
                  <div className="text-sm border-b border-gray-300 py-0.5">
                    <span
                      className={`rounded px-1  mx-1 
                    ${
                      isRatingBuy(r.rating_current)
                        ? "bg-green-200 text-green-900"
                        : isRatingSell(r.rating_current)
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                    } `}
                    >
                      {r.rating_current}
                    </span>
                    {r.analyst}
                    <span className="ml-2">
                      ({formatDistance(new Date(r.date), new Date(), { includeSeconds: false })} ago)
                    </span>
                  </div>
                );
              })}
          </td>
        </tr>
      )}
    </>
  );
};

export default StakeItem;
