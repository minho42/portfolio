import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { LoadingIcon } from "./LoadingIcon";
import { useLocalStorage } from "./useLocalStorage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const timestampToDate = (ts) => {
  return new Date(ts * 1000).toLocaleDateString();
};
const dateStrToTimestamp = (str) => {
  // '2021-10-06T13:30:15.312Z'
  return Math.round(new Date(str).getTime() / 1000);
};

const TIME_FRAME = 5 * 4 * 12 * 2;

export const StakeChartModal = ({ symbol, name, transactions, isOpen, onClose }) => {
  const [chartData, setChartData] = useLocalStorage(`stakeChartData-${symbol}`, []);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChartData = async (symbol) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/chart/data/${symbol}`);
      if (res.status !== 200) {
        throw new Error("StakeChartModal error");
      }
      let {
        data: { timestamp, quote },
      } = await res.json();
      timestamp = timestamp.slice(-TIME_FRAME);
      quote = quote.slice(-TIME_FRAME);

      let tempChartData = [];
      if (timestamp && quote) {
        timestamp.forEach((item, i) => {
          tempChartData.push({ timestamp: item, quote: quote[i].toFixed(2) });
        });
      }

      if (transactions) {
        transactions.forEach((t) => {
          const transactionDateFromChartData = tempChartData.find((item) => {
            return Math.abs(item.timestamp - dateStrToTimestamp(t.timestamp)) / 60 / 60 < 24;
          });
          tempChartData.push({
            timestamp: dateStrToTimestamp(t.timestamp),
            transaction: transactionDateFromChartData.quote,
          });
        });
      }

      tempChartData.sort((a, b) => {
        if (a.timestamp > b.timestamp) return 1;
        else return -1;
      });

      tempChartData = tempChartData.map(({ timestamp, quote, transaction }) => {
        return {
          timestamp: timestampToDate(timestamp),
          quote,
          transaction,
        };
      });

      setChartData(tempChartData);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setChartData([]);
      setIsLoading(false);
    }
  };

  const escClose = (e) => {
    if (e.keyCode === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", escClose);
    return () => {
      document.removeEventListener("keydown", escClose);
    };
  }, []);

  useEffect(() => {
    fetchChartData(symbol);
  }, []);

  if (!isOpen) {
    return null;
  }

  const xAxisFormatter = (item) => {
    if (!item) return;
    return item.slice(3, 10);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0">
      <div
        id="overlay"
        className="min-h-screen min-w-screen bg-black opacity-40"
        onClick={() => onClose()}
      ></div>

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-gray-200 rounded-lg shadow-2xl space-y-1 p-2">
        <div className="bg-white rounded p-2">
          <div className="text-xl text-center">{symbol}</div>
          <div className="text-center text-sm text-gray-500">{name}</div>
        </div>
        <div className="bg-white rounded p-2">
          <div className="flex justify-center text-sm text-gray-600">
            <button>2Y</button>
          </div>
          {!chartData && isLoading ? (
            <LoadingIcon />
          ) : (
            <LineChart
              width={720}
              height={360}
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="1"
                stroke="#abafb1"
                xAxis={false}
                yAxis={false}
                // color="#f9f9f9"
              />
              <XAxis
                dataKey="timestamp"
                fontSize="12px"
                color="#666666"
                tickSize="0"
                tickMargin="10"
                // tickFormatter={xAxisFormatter}
              />
              <YAxis
                fontSize="12px"
                color="#666666"
                tickSize="0"
                tickCount="7"
                tickMargin="10"
                // domain={["dataMin", "dataMax"]}
                domain={[
                  (dataMin) => Math.round(dataMin / 100) * 100 - 100,
                  (dataMax) => Math.ceil(dataMax / 100) * 100,
                ]}
                allowDataOverflow={true}
              />
              {/* <Tooltip /> */}
              <Line
                connectNulls
                type="natural"
                dataKey="quote"
                stroke="#000"
                strokeWidth="1.4px"
                activeDot={{ r: 5, color: "#10b882" }}
                dot={false}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="transaction"
                dot={{
                  fill: "white",
                  // fillOpacity: "0.5",
                  stroke: "#0081f2",
                  strokeWidth: 4,
                  // strokeOpacity: "0.5",
                }}
                isAnimationActive={false}
              />
            </LineChart>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};
