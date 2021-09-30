import { useState, useEffect } from "react";
import CoinbaseItem from "./CoinbaseItem";

const CoinbaseList = () => {
  const [accounts, setAccounts] = useState(null);
  const [rates, setRates] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:4000/coinbase/accounts");
      const { accounts } = await res.json();
      setAccounts(accounts);
    } catch (error) {}
  };

  const fetchExchangeRates = async () => {
    try {
      const res = await fetch("http://localhost:4000/coinbase/exchangeRates");
      const { data } = await res.json();
      setRates(data.rates);
    } catch (error) {}
  };

  const getTotalAmount = () => {
    if (!accounts || !rates) return;

    let total = 0;
    accounts.forEach((account) => {
      total += account.balance.amount / rates[account.balance.currency];
    });
    setTotalAmount(total);
  };

  useEffect(() => {
    fetchAccounts();
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    getTotalAmount();
  }, [accounts, rates]);

  return (
    <div className="flex flex-col px-3 py-3 space-y-3 bg-white">
      <div className="flex justify-center text-2xl">Coinbase</div>
      <div className="flex justify-center space-y-2 w-full">
        {totalAmount && (
          <div className="uppercase text-xs tracking-wider">
            Portfolio balance
            <div className="flex text-2xl">
              <div className="flex">≈ A${totalAmount.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <table className="w-11/12">
          <thead>
            <tr className="border-b-2 border-gray-700">
              <th className="text-sm uppercase font-medium">Name</th>
              <th className="text-sm uppercase font-medium">Amount</th>
              <th className="text-sm uppercase font-medium">AUD</th>
            </tr>
          </thead>
          <tbody>
            {accounts &&
              accounts.map((account) => {
                return <CoinbaseItem key={account.id} data={account} rates={rates} />;
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinbaseList;
