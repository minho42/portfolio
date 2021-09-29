import { useState, useEffect } from "react";
import CoinbaseItem from "./CoinbaseItem";

const CoinbaseList = () => {
  const [accounts, setAccounts] = useState(null);
  const [rates, setRates] = useState(null);

  const fetchAccounts = async () => {
    const res = await fetch("http://localhost:4000/coinbase/accounts");
    const { accounts } = await res.json();
    setAccounts(accounts);
  };

  const fetchExchangeRates = async () => {
    const res = await fetch("http://localhost:4000/coinbase/exchangeRates");
    const { data } = await res.json();
    setRates(data.rates);
  };

  useEffect(() => {
    fetchAccounts();
    fetchExchangeRates();
  }, []);

  return (
    <div className="flex flex-col px-3 py-3 space-y-3">
      <div className="flex justify-center space-y-2 w-full">
        <div className="flex text-2xl">Coinbase</div>
      </div>
      <div className="">
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
