import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { useUpdatePortfolioInfo } from "./useUpdatePortfolioInfo";
import StakeItem from "./StakeItem";
import { isPositive, showValueWithSign, showValueWithComma } from "../utils";
import { Link } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { LoadingIcon } from "./LoadingIcon";

const StakeList = () => {
  const { stakeToken, isStakeAuthLoading } = useContext(UserContext);
  const [equityPositions, setEquityPositions] = useLocalStorage("stakeEquityPositions", []);
  const [equityValue, setEquityValue] = useLocalStorage("stakeEquityValue", 0);
  const [equityValueInAud, setEquityValueInAud] = useState(0);
  useUpdatePortfolioInfo("Stake", equityValueInAud);
  const [currencyUsdAud, setCurrencyUsdAud] = useLocalStorage("currencyUsdAud", 0);
  const [currencyAudUsd, setCurrencyAudUsd] = useLocalStorage("currencyAudUsd", 0);
  const [userInfo, setUserInfo] = useLocalStorage("stakeUserInfo", {});
  const [errorMessage, setErrorMessage] = useState(null);
  const [dayChangeSum, setDayChangeSum] = useState(0);
  const [totalChangeSum, setTotalChangeSum] = useState(0);
  const [totalChangePercentage, setTotalChangePercentage] = useState(0);
  const [totalEstimatedDividends, setTotalEstimatedDividends] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const addTotalEstimatedDividends = (n) => {
    setTotalEstimatedDividends(totalEstimatedDividends + n);
  };

  const fetchUserInfo = async () => {
    if (!stakeToken) return;

    try {
      const res = await fetch(`https://global-prd-api.hellostake.com/api/sessions/v2/${stakeToken}`);
      if (!res.ok) {
        throw new Error("fetchUserInfo failed");
      }
      const data = await res.json();
      setUserInfo(data);
    } catch (error) {
      console.log(error);
      setUserInfo(null);
    }
  };

  const fetchCurrencyUsdAud = async () => {
    try {
      const res = await fetch("http://localhost:4000/currency/UsdAud");
      const { rate } = await res.json();
      setCurrencyUsdAud(rate);
    } catch (error) {
      console.log(error);
      setCurrencyUsdAud(0);
    }
  };

  const fetchCurrencyAudUsd = async () => {
    try {
      const res = await fetch("http://localhost:4000/currency/AudUsd");
      const { rate } = await res.json();
      setCurrencyAudUsd(rate);
    } catch (error) {
      console.log(error);
      setCurrencyAudUsd(0);
    }
  };

  const fetchStakeData = async () => {
    setIsLoading(true);
    if (!stakeToken) {
      setEquityPositions([]);
      setEquityValue(null);
      setDayChangeSum(0);
      setTotalChangeSum(0);
      setTotalChangePercentage(0);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/stake/api/stake", {
        credentials: "include",
      });
      if (res.status !== 200) {
        throw new Error("fetchStakeData error");
      }
      const {
        data: { equityPositions, equityValue },
      } = await res.json();

      const equityPositionsSortedByValue = [...equityPositions].sort((a, b) => {
        if (Number.parseFloat(a.marketValue) >= Number.parseFloat(b.marketValue)) return -1;
        return 1;
      });
      // console.log(equityPositionsSortedByValue);
      setEquityPositions(equityPositionsSortedByValue);
      setEquityValue(equityValue);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  const getDayChangeSum = () => {
    let sum = 0;
    equityPositions.map((position) => {
      sum += Number.parseFloat(position.unrealizedDayPL);
    });
    setDayChangeSum(sum.toFixed(2));
  };

  const getTotalChangeSum = () => {
    let sum = 0;
    equityPositions.map((position) => {
      sum += Number.parseFloat(position.unrealizedPL);
    });
    setTotalChangeSum(sum.toFixed(2));
    setTotalChangePercentage(
      ((Number.parseFloat(sum.toFixed(2)) / Number.parseFloat(equityValue)) * 100).toFixed(2)
    );
  };

  useEffect(() => {
    fetchStakeData();
    fetchUserInfo();
  }, [stakeToken]);

  useEffect(() => {
    fetchCurrencyUsdAud();
    fetchCurrencyAudUsd();
  }, []);

  useEffect(() => {
    getDayChangeSum();
    getTotalChangeSum();
    setEquityValueInAud(equityValue * currencyUsdAud);
  }, [equityValue]);

  useEffect(() => {
    setEquityValueInAud(equityValue * currencyUsdAud);
  }, [currencyUsdAud]);

  return (
    <div className=" flex flex-col px-3 py-3 space-y-3 bg-white rounded-xl">
      <div className="flex justify-center text-2xl relative">
        Stake
        <div className="absolute top-0 right-0 text-xs text-gray-500">
          {userInfo && <div className="uppercase">{userInfo.firstName + " " + userInfo.lastName}</div>}
          <div>AUD/USD: {currencyAudUsd.toFixed(2)}</div>
        </div>
      </div>
      <div className="flex justify-center space-y-2 w-full">
        {isStakeAuthLoading ? (
          <div>Checking token...</div>
        ) : !stakeToken ? (
          <div>
            <Link to="/login" className="text-green-500 hover:underline">
              Log in
            </Link>
          </div>
        ) : equityValue ? (
          <div className="uppercase text-xs tracking-wider">
            Equity value
            <div className="flex items-center text-2xl">
              <div>A${showValueWithComma(equityValueInAud)}</div>
              {isLoading ? <LoadingIcon /> : ""}
            </div>
          </div>
        ) : (
          <div>{errorMessage}</div>
        )}
      </div>
      <div className="flex justify-center">
        {stakeToken && equityPositions && (
          <table className="w-11/12">
            <thead>
              <tr className="border-b-2 border-gray-700 text-right">
                <th className="text-sm uppercase font-medium text-center">Code</th>
                <th className="text-sm uppercase font-medium">Units</th>
                <th className="text-sm uppercase font-medium">Value</th>
                <th className="text-sm uppercase font-medium">Day P/L</th>
                <th className="text-sm uppercase font-medium">Total P/L</th>
                <th className="text-sm uppercase font-medium">Dividend yield</th>
                <th className="text-sm uppercase font-medium">Dividends</th>
                <th className="text-sm uppercase font-medium">Ratings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {equityPositions.map((position) => {
                return (
                  <StakeItem
                    key={position.symbol}
                    data={position}
                    isPositive={isPositive}
                    showValueWithSign={showValueWithSign}
                    addTotalEstimatedDividends={addTotalEstimatedDividends}
                  />
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-700 text-sm text-right font-semibold">
                <td className="text-center uppercase py-1">Totals</td>
                <td>-</td>
                <td>${showValueWithComma(equityValue)}</td>
                <td className={`${isPositive(dayChangeSum) ? "text-green-600" : "text-red-600"}`}>
                  {showValueWithSign(dayChangeSum)}
                </td>
                <td className={`${isPositive(totalChangeSum) ? "text-green-600" : "text-red-600"}`}>
                  {showValueWithSign(totalChangeSum)} ({`${showValueWithSign(totalChangePercentage)}%`})
                </td>
                <td>-</td>
                <td>{showValueWithComma(totalEstimatedDividends)}</td>
                <td>-</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default StakeList;
