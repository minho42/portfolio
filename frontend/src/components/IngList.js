import { useState, useEffect } from "react";
import { showValueWithComma } from "../utils";
import { useLocalStorage } from "./useLocalStorage";
import { LoadingIcon } from "./LoadingIcon";
import { useUpdatePortfolioInfo } from "./useUpdatePortfolioInfo";

const IngList = () => {
  const [interestRate, setInterestRate] = useLocalStorage("ingInterestRate", 0);
  const [balance, setBalance] = useLocalStorage("ingBalance", 0);
  useUpdatePortfolioInfo("ING", balance);
  const [name, setName] = useLocalStorage("ingUserName", "");
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchInterestRate = async () => {
    try {
      const res = await fetch("http://localhost:4000/ing/interestRate");
      const { interestRate } = await res.json();
      setInterestRate(interestRate);
    } catch (error) {}
  };

  const fetchBalance = async () => {
    try {
      const res = await fetch("http://localhost:4000/ing/balance");
      const { data } = await res.json();
      setBalance(data.balance);
      setName(data.name);
      setIsBalanceLoading(false);
    } catch (error) {
      setIsBalanceLoading(false);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchInterestRate();
  }, []);

  return (
    <div className="flex flex-col px-3 py-3 space-y-3 bg-white rounded-xl border border-gray-300">
      <div className="flex justify-center relative text-gray-500">
        ING
        <div className="absolute top-0 right-0 text-xs text-gray-500">{name}</div>
      </div>
      <div className="flex justify-center space-y-2 w-full">
        {errorMessage ? (
          <div className="text-gray-500">{errorMessage}</div>
        ) : (
          <div className="text-xs tracking-wider">
            <div className="text-gray-500">Total balance</div>
            <div className="flex items-center text-2xl ">
              <div className="flex">${showValueWithComma(balance, true)}</div>
              {isBalanceLoading ? <LoadingIcon /> : ""}
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="text-center text-sm text-gray-500">Interest rate: {interestRate}%</div>
      </div>
    </div>
  );
};

export default IngList;
