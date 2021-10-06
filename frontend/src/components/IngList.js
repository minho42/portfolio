import { useState, useEffect } from "react";
import { showValueWithComma } from "../utils";

const IngList = () => {
  const [interestRate, setInterestRate] = useState(null);
  const [balance, setBalance] = useState(null);
  const [name, setName] = useState(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);

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
        <div className="absolute top-0 right-0 text-xs text-gray-500">{name}</div>
      </div>
      <div className="flex justify-center space-y-2 w-full">
        {isBalanceLoading ? (
          <div className="animate-bounce">Loading...</div>
        ) : (
          <div className="uppercase text-xs tracking-wider">
            Total balance
            <div className="flex text-2xl">
              <div className="flex">${showValueWithComma(balance)}</div>
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
