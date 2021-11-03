import { useEffect, useState } from "react";
import { isPositive, showValueWithSign, showValueWithComma, getChangePercentage } from "../utils";
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
  const [unrealizedDayPLPercentage, setUnrealizedDayPLPercentage] = useState(0);
  const [unrealizedPLPercentage, setUnrealizedPLPercentage] = useState(0);

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
          trans.push({
            id: t.orderID,
            timestamp: t.timestamp,
            tranAmount: t.tranAmount,
            transactionType: t.transactionType,
          });
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

  const setPercentages = () => {
    setUnrealizedDayPLPercentage(getChangePercentage(marketValue, unrealizedDayPL));
    setUnrealizedPLPercentage(getChangePercentage(marketValue, unrealizedPL));
  };

  useEffect(async () => {
    const d = await fetchDividendYield();
    setDividendYield(d);
    getTotalDividendInfo();
    getTransactions();
    setPercentages();
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
        className={`text-right text-sm hover:shadow-md cursor-pointer ${
          index === focusedIndex ? "shadow-md" : ""
        }`}
      >
        <td
          className={`py-1 text-center text-sm cursor-pointer border-l-8  ${
            index === focusedIndex ? "border-green-500" : "border-white"
          }`}
        >
          {symbol}
        </td>
        {/* <td className="">{showValueWithComma(openQty)}</td> */}
        <td>${showValueWithComma(marketValue)}</td>
        <td className={` ${isPositive(unrealizedDayPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedDayPL)}
          <span className="ml-1">({showValueWithSign(unrealizedDayPLPercentage, "")}%)</span>
        </td>
        <td className={` ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedPL)}
          <span className="ml-1">({showValueWithSign(unrealizedPLPercentage, "")}%)</span>
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
          marketValue={marketValue}
          unrealizedPL={unrealizedPL}
          unrealizedPLPercentage={unrealizedPLPercentage}
          transactions={transactions}
          isOpen={isChartModalOpen}
          onClose={handleChartModalClose}
        />
      )}
    </>
  );
};

export default StakeItem;
