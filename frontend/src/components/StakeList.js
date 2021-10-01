import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import StakeItem from "./StakeItem";
import { isPositive, showValueWithSign } from "../utils";
import { Link } from "react-router-dom";

const StakeList = () => {
  const { token } = useContext(UserContext);
  const [equityPositions, setEquityPositions] = useState([]);
  const [equityValue, setEquityValue] = useState(null);
  const [totalChangeSum, setTotalChangeSum] = useState(0);
  const [totalChangePercentage, setTotalChangePercentage] = useState(0);
  const [currencyUsdAud, setCurrencyUsdAud] = useState(0);
  const [currencyAudUsd, setCurrencyAudUsd] = useState(0);

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
    if (!token) {
      setEquityPositions([]);
      setEquityValue(null);
      setTotalChangeSum(0);
      setTotalChangePercentage(0);
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

      setEquityPositions(equityPositions);
      setEquityValue(equityValue);

      let sum = 0;
      equityPositions.map((position) => {
        sum += Number.parseFloat(position.unrealizedPL);
      });
      setTotalChangeSum(sum.toFixed(2));
      setTotalChangePercentage(
        ((Number.parseFloat(sum.toFixed(2)) / Number.parseFloat(equityValue)) * 100).toFixed(2)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStakeData();
  }, [token]);

  useEffect(() => {
    fetchCurrencyUsdAud();
    fetchCurrencyAudUsd();
  }, []);

  return (
    <div className=" flex flex-col px-3 py-3 space-y-3 bg-white rounded-xl">
      <div className="flex justify-center text-2xl relative">
        Stake
        <div className="absolute top-0 right-0 text-xs text-gray-500">
          AUD/USD: {currencyAudUsd.toFixed(2)}
        </div>
      </div>
      <div className="flex justify-center space-y-2 w-full">
        {equityValue ? (
          <div className="uppercase text-xs tracking-wider">
            Equity value
            <div className="flex text-2xl">
              <div className="flex">
                ${equityValue.toLocaleString()}
                <div className={`ml-2 ${isPositive(totalChangeSum) ? "text-green-600" : "text-red-600"}`}>
                  {showValueWithSign(totalChangeSum)} ({`${showValueWithSign(totalChangePercentage)}%`})
                </div>
              </div>
              <div className="ml-3">
                ≈ A${Number.parseFloat((equityValue * currencyUsdAud).toFixed(2)).toLocaleString()}
              </div>
            </div>
          </div>
        ) : token ? (
          <div>Loading...</div>
        ) : (
          <div>
            <Link to="/login" className="text-green-500 hover:underline">
              Log in
            </Link>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {token && equityPositions && (
          <table className="w-11/12">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th className="text-sm uppercase font-medium">Stock</th>
                <th className="text-sm uppercase font-medium">Units</th>
                <th className="text-sm uppercase font-medium">Value</th>
                <th className="text-sm uppercase font-medium">Day change</th>
                <th className="text-sm uppercase font-medium">Total change</th>
                <th className="text-sm uppercase font-medium">Dividend yield</th>
              </tr>
            </thead>
            <tbody>
              {equityPositions.map((position) => {
                return (
                  <StakeItem
                    key={position.symbol}
                    data={position}
                    isPositive={isPositive}
                    showValueWithSign={showValueWithSign}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StakeList;
