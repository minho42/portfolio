import React from "react";

const PortfolioItem = ({
  data: { symbol, openQty, marketValue, unrealizedDayPL, unrealizedPL },
  isPositive,
  showValueWithSign,
}) => {
  return (
    <tr className="border-b border-gray-300 text-center font-mono text-sm">
      <td className="py-2">{symbol}</td>
      <td className="py-2">{Number.parseFloat(openQty).toFixed(2)}</td>
      <td className={`py-2 ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
        ${marketValue}
      </td>
      <td className={`py-2 ${isPositive(unrealizedDayPL) ? "text-green-600" : "text-red-600"}`}>
        {showValueWithSign(unrealizedDayPL)}
      </td>
      <td className={`py-2 ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
        {showValueWithSign(unrealizedPL)}
      </td>
    </tr>
  );
};

export default PortfolioItem;
