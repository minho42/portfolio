import { useState, useEffect } from "react";
import { showValueWithComma } from "../utils";
import { useLocalStorage } from "./useLocalStorage";
import { LoadingIcon } from "./LoadingIcon";

const IngList = () => {
  const [interestRate, setInterestRate] = useLocalStorage("ingInterestRate", 0);
  const [balance, setBalance] = useLocalStorage("ingBalance", 0);
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
    <div className="flex flex-col px-3 py-3 space-y-3 bg-white rounded-xl">
      <div className="flex justify-center text-2xl relative">
        ING
        <div className="absolute top-0 right-0 text-xs text-gray-500 uppercase">{name}</div>
      </div>
      <div className="flex justify-center space-y-2 w-full">
        {errorMessage ? (
          <div className="text-gray-500">{errorMessage}</div>
        ) : (
          <div className="uppercase text-xs tracking-wider">
            Total balance
            <div className="flex items-center text-2xl ">
              <div className="flex">${showValueWithComma(balance)}</div>
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
