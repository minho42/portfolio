import { useEffect, useState } from "react";
import { isPositive, showValueWithSign, showValueWithComma } from "../utils";
import { StakeRatings } from "./StakeRatings";
import { StakeChartModal } from "./StakeChartModal";

const StakeItem = ({
  index,
  focusedIndex,
  setFocusedIndex,
  position: { symbol, openQty, marketValue, unrealizedDayPL, unrealizedPL, encodedName, name },
  transactionHistory,
  addTotalExpectedDividends,
  addTotalDividend,
  addTotalDividendTax,
}) => {
  const [dividendYield, setDividendYield] = useState(null);
  const [totalDividend, setTotalDividend] = useState(0);
  const [totalDividendTax, setTotalDividendTax] = useState(0);
  const [transactions, setTransactions] = useState(null);
  const [expectedDividend, setExpectedDividend] = useState(0);

  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  const handleChartModalClose = () => {
    setIsChartModalOpen(false);
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
  }, []);

  useEffect(() => {
    const expectedDividend = (marketValue * dividendYield) / 100;
    setExpectedDividend(expectedDividend);
    addTotalExpectedDividends(expectedDividend);
  }, [dividendYield]);

  useEffect(() => {
    addTotalDividend(totalDividend);
  }, [totalDividend]);

  useEffect(() => {
    addTotalDividendTax(totalDividendTax);
  }, [totalDividendTax]);

  const keyboardShortcuts = (e) => {
    if (e.keyCode === 79 || e.keyCode === 13) {
      // open
      if (index === focusedIndex) {
        setIsChartModalOpen(!isChartModalOpen);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyboardShortcuts);
    return () => {
      document.removeEventListener("keydown", keyboardShortcuts);
    };
  }, [focusedIndex]);

  return (
    <>
      <tr
        onClick={() => {
          setFocusedIndex(index);
          setIsChartModalOpen(!isChartModalOpen);
        }}
        className={`text-right text-sm hover:bg-gray-100 cursor-pointer ${
          index === focusedIndex ? "shadow-md bg-gradient-to-r from-white to-blue-100" : ""
        }`}
      >
        <td
          className={`py-1 text-center text-sm hover:bg-gray-100 cursor-pointer border-l-8  ${
            index === focusedIndex ? "border-blue-500" : "border-white"
          }`}
        >
          {symbol}
        </td>
        {/* <td className="">{showValueWithComma(openQty)}</td> */}
        <td>${Number.parseFloat(marketValue).toLocaleString()}</td>
        <td className={` ${isPositive(unrealizedDayPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedDayPL)}
        </td>
        <td className={` ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedPL)}
        </td>
        <td>{dividendYield > 0 ? `${Number.parseFloat(dividendYield).toFixed(2)}%` : ""}</td>
        <td>{expectedDividend > 0 ? showValueWithComma(expectedDividend) : ""}</td>
        <td>{totalDividend > 0 ? showValueWithComma(totalDividend) : ""}</td>
        <td>{totalDividendTax > 0 ? showValueWithComma(totalDividendTax) : ""}</td>
        {/* <td>
          <StakeRatings symbol={symbol} name={name} />
        </td> */}
      </tr>

      {isChartModalOpen && (
        <StakeChartModal
          symbol={symbol}
          name={name}
          transactions={transactions}
          isOpen={isChartModalOpen}
          onClose={handleChartModalClose}
        />
      )}
    </>
  );
};

export default StakeItem;
