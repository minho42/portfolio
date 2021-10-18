import { useEffect, useState } from "react";
import { isPositive, showValueWithSign, showValueWithComma } from "../utils";
import { StakeRatingsModal } from "./StakeRatingsModal";

const StakeItem = ({
  position: { urlImage, symbol, openQty, marketValue, unrealizedDayPL, unrealizedPL, encodedName, name },
  transactionHistory,
  addTotalEstimatedDividends,
  addTotalDividend,
  addTotalDividendTax,
}) => {
  const [dividendYield, setDividendYield] = useState(null);
  const [totalDividend, setTotalDividend] = useState(0);
  const [totalDividendTax, setTotalDividendTax] = useState(0);
  const [transactions, setTransactions] = useState(null);
  const [estimatedDividend, setEstimatedDividend] = useState(0);
  const [ratings, setRatings] = useState(null);
  const [showRatings, setShowRatings] = useState(false);
  const [buyCount, setBuyCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);
  const [holdCount, setHoldCount] = useState(0);
  const [isRatingsModalOpen, setIsRatingsModalOpen] = useState(false);

  const handleRatingsModalClose = () => {
    setIsRatingsModalOpen(false);
  };

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
      // ETFs don't have ratings
      if (!ratings) return;
      // setRatings(ratings);
      setRatings(ratings.slice(0, 10));
      countBuySell(ratings.slice(0, 10));
    } catch (error) {
      console.log(error);
    }
  };

  const getTransactions = () => {
    if (!transactionHistory) return;

    const trans = [];

    transactionHistory.forEach((t) => {
      if (t.symbol === symbol) {
        if (t.transactionType === "Buy" || t.transactionType === "Sell") {
          trans.push({ timestamp: t.timestamp, tranAmount: t.tranAmount });
        }
      }
    });

    setTransactions(trans);
  };

  const getTotalDividendInfo = () => {
    if (!transactionHistory) return;

    let dividendSum = 0;
    let dividendTaxSum = 0;

    transactionHistory.forEach((t) => {
      if (t.symbol === symbol) {
        if (t.transactionType === "Dividend") {
          dividendSum += t.tranAmount;
        }
        if (t.transactionType === "Dividend Tax") {
          dividendTaxSum += t.tranAmount;
        }
      }
    });

    setTotalDividend(dividendSum);
    setTotalDividendTax(-dividendTaxSum);
  };

  useEffect(async () => {
    const d = await fetchDividendYield();
    setDividendYield(d);
    getTotalDividendInfo();
    getTransactions();
    fetchRatings();
  }, []);

  useEffect(() => {
    const estimatedDividend = (marketValue * dividendYield) / 100;
    setEstimatedDividend(estimatedDividend);
    addTotalEstimatedDividends(estimatedDividend);
  }, [dividendYield]);

  useEffect(() => {
    addTotalDividend(totalDividend);
  }, [totalDividend]);

  useEffect(() => {
    addTotalDividendTax(totalDividendTax);
  }, [totalDividendTax]);

  return (
    <>
      <tr className="text-right text-sm hover:bg-gray-100">
        <td className="py-1 text-center">{symbol}</td>
        <td className="">{showValueWithComma(openQty)}</td>
        <td className={` ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
          ${Number.parseFloat(marketValue).toLocaleString()}
        </td>
        <td className={` ${isPositive(unrealizedDayPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedDayPL)}
        </td>
        <td className={` ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedPL)}
        </td>
        <td>{dividendYield > 0 ? `${Number.parseFloat(dividendYield).toFixed(2)}%` : ""}</td>
        <td>{estimatedDividend > 0 ? showValueWithComma(estimatedDividend) : ""}</td>
        <td>{totalDividend > 0 ? showValueWithComma(totalDividend) : ""}</td>
        <td>{totalDividendTax > 0 ? showValueWithComma(totalDividendTax) : ""}</td>
        <td className="text-center">{transactions && transactions.length}</td>
        <td
          onClick={() => {
            setIsRatingsModalOpen(!isRatingsModalOpen);
          }}
          className="flex items-center justify-start space-x-1 cursor-pointer"
        >
          {/* {buyCount + sellCount + holdCount === 0 ? "-" : ""} */}

          {buyCount > 0 && (
            <div className="flex items-center text-xs">
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
            <div className="flex items-center text-xs">
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
            <div className="flex items-center text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-300"
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

      {ratings && isRatingsModalOpen && (
        <StakeRatingsModal
          symbol={symbol}
          name={name}
          ratings={ratings}
          isOpen={isRatingsModalOpen}
          onClose={handleRatingsModalClose}
          isRatingBuy={isRatingBuy}
          isRatingSell={isRatingSell}
        />
      )}
    </>
  );
};

export default StakeItem;
