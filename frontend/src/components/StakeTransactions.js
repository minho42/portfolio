import { showValueWithComma, timestampToDate, dateStrToTimestamp } from "../utils";

export const StakeTransactions = ({ transactions }) => {
  return (
    <div className=" bg-white rounded p-2 divide-y space-y-1 overflow-y-auto" style={{ height: 470 }}>
      <div className="text-xl text-center">Transactions</div>
      {transactions.map((t) => {
        return (
          <div key={t.id} className="flex items-center text-xs text-gray-500 py-1 hover:bg-gray-100">
            {timestampToDate(dateStrToTimestamp(t.timestamp))}:
            <div
              className={`${
                t.transactionType === "Buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              } flex rounded px-1 `}
            >
              ${showValueWithComma(-t.tranAmount, false)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
