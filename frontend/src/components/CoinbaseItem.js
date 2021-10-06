import React from "react";

const CoinbaseItem = ({ data: { currency, balance }, rates }) => {
  return (
    <tr className="border-b border-gray-300 text-center text-sm hover:bg-gray-100">
      <td className="py-1">{currency.name}</td>
      <td className="py-1">
        {Number.parseFloat(balance.amount).toFixed(4)} {balance.currency}
      </td>
      <td className="py-1">${(balance.amount / rates[balance.currency]).toFixed(2)}</td>
    </tr>
  );
};

export default CoinbaseItem;
