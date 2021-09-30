import { useEffect, useState } from "react";

const StakeItem = ({
  data: { urlImage, symbol, openQty, marketValue, unrealizedDayPL, unrealizedPL, encodedName },
  isPositive,
  showValueWithSign,
}) => {
  const [dividendYield, setDividendYield] = useState(null);

  const fetchDividendYield = async () => {
    try {
      const res = await fetch(
        `https://global-prd-api.hellostake.com/api/instruments/getDWInstrumentStats/${encodedName}`
      );
      const data = await res.json();
      return data.fundamentalDataModel.dividendYield;
    } catch (error) {
      console.log(error);
      return -1;
    }
  };

  useEffect(async () => {
    const d = await fetchDividendYield();
    setDividendYield(d);
  }, []);

  return (
    <tr className="border-b border-gray-300 text-center text-sm">
      <td className="py-1">{symbol}</td>
      <td className="py-1">{Number.parseFloat(Number.parseFloat(openQty).toFixed(2)).toLocaleString()}</td>
      <td className={`py-1 ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
        ${Number.parseFloat(marketValue).toLocaleString()}
      </td>
      <td className={`py-1 ${isPositive(unrealizedDayPL) ? "text-green-600" : "text-red-600"}`}>
        {showValueWithSign(unrealizedDayPL)}
      </td>
      <td className={`py-1 ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
        {showValueWithSign(unrealizedPL)}
      </td>
      <td>{dividendYield > 0 ? `${Number.parseFloat(dividendYield).toFixed(2)}%` : "-"}</td>
    </tr>
  );
};

export default StakeItem;
