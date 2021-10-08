import { useState, useEffect } from "react";
import { showValueWithComma } from "../utils";
import { useLocalStorage } from "./useLocalStorage";

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
              {isBalanceLoading ? (
                <div className="text-gray-500 animate-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              ) : (
                ""
              )}
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
