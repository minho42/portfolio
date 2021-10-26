import { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { LoadingIcon } from "./LoadingIcon";
import { useLocalStorage } from "./useLocalStorage";
import { Line, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { SiteStatusContext } from "../SiteStatusContext";

const timestampToDate = (ts) => {
  return new Date(ts * 1000).toLocaleDateString();
};
const dateStrToTimestamp = (str) => {
  // '2021-10-06T13:30:15.312Z'
  return Math.round(new Date(str).getTime() / 1000);
};

export const StakeChartModal = ({ symbol, name, transactions, isOpen, onClose }) => {
  const [chartData, setChartData] = useLocalStorage(`stakeChartData-${symbol}`, []);
  const [chartDataTimeFramed, setChartDataTimeFramed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeFrameName, setSelectedTimeFrameName] = useLocalStorage(`stakeChartTimeFrame`, "1y");
  const { isStateChartModalOpen, setIsStateChartModalOpen } = useContext(SiteStatusContext);
  const timeFrames = [
    {
      name: "1m",
      inDays: 21,
    },
    {
      name: "3m",
      inDays: 21 * 3,
    },
    {
      name: "6m",
      inDays: 21 * 6,
    },
    {
      name: "1y",
      inDays: 5 * 52 * 1,
    },
    {
      name: "2y",
      inDays: 5 * 52 * 2,
    },
    {
      name: "5y",
      inDays: 5 * 52 * 5,
    },
    // {
    //   name: "10y",
    //   inDays: 5 * 52 * 10,
    // },
    // {
    //   name: "all",
    //   inDays: 0,
    // },
  ];
  const handleTimeFrameChange = (e) => {
    setSelectedTimeFrameName(e.target.innerHTML);
  };

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

          // remove same date first before pushing transaction data to prevent duplicate dates
          const removeIndex = tempChartData.findIndex((d) => {
            const a = new Date(d.timestamp * 1000);
            const b = new Date(dateStrToTimestamp(t.timestamp) * 1000);
            return (
              a.getYear() === b.getYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
            );
          });

          // console.log(`removeIndex: ${removeIndex}`);
          if (removeIndex >= 0) {
            tempChartData.splice(removeIndex, 1);
          }

          tempChartData.push({
            timestamp: dateStrToTimestamp(t.timestamp),
            quote: transactionDateFromChartData.quote,
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

  const keyboardShortcuts = (e) => {
    if (e.keyCode === 27) {
      onClose();
    }
    // TODO: refactor this to reduce duplicate
    else if (e.keyCode === 37 || e.keyCode === 74) {
      let selectedTimeFrameIndex = timeFrames.findIndex((tf) => tf.name === selectedTimeFrameName);

      let newIndex = selectedTimeFrameIndex - 1;
      if (newIndex < 0) {
        newIndex = timeFrames.length - 1;
      }
      let newTimeFrameName = timeFrames[newIndex].name;
      setSelectedTimeFrameName(newTimeFrameName);
    } else if (e.keyCode === 39 || e.keyCode === 75) {
      let selectedTimeFrameIndex = timeFrames.findIndex((tf) => tf.name === selectedTimeFrameName);

      let newIndex = selectedTimeFrameIndex + 1;
      if (newIndex > timeFrames.length - 1) {
        newIndex = 0;
      }
      let newTimeFrameName = timeFrames[newIndex].name;
      setSelectedTimeFrameName(newTimeFrameName);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyboardShortcuts);
    setIsStateChartModalOpen(true);
    return () => {
      document.removeEventListener("keydown", keyboardShortcuts);
      setIsStateChartModalOpen(false);
    };
  }, [selectedTimeFrameName]);

  useEffect(() => {
    fetchChartData(symbol);
    setIsStateChartModalOpen(true);
    return () => {
      setIsStateChartModalOpen(false);
    };
  }, []);

  useEffect(() => {
    if (!chartData || !selectedTimeFrameName) return;

    const selectedTimeFrame = timeFrames.find((tf) => tf.name === selectedTimeFrameName);
    let days = 0;
    if (selectedTimeFrame) {
      days = selectedTimeFrame.inDays;
    } else {
      days = 0;
    }

    setChartDataTimeFramed(chartData.slice(-days));
  }, [selectedTimeFrameName]);

  if (!isOpen) {
    return null;
  }

  const xAxisFormatter = (item) => {
    if (!item) return;
    if (typeof item !== "string") return;
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
          <div className="flex justify-center text-sm text-gray-600 space-x-1">
            {timeFrames.map((tf) => {
              return (
                <button
                  onClick={handleTimeFrameChange}
                  key={tf.name}
                  className={`${
                    selectedTimeFrameName === tf.name ? " border-blue-500" : ""
                  } border-b-4 border-white px-2 py-0.5 uppercase focus:outline-none`}
                >
                  {tf.name}
                </button>
              );
            })}
          </div>
          {!chartDataTimeFramed && isLoading ? (
            <LoadingIcon />
          ) : (
            <ComposedChart
              width={720}
              height={360}
              data={chartDataTimeFramed}
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
                fontSize="11px"
                color="#666666"
                tickSize="0"
                tickMargin="10"
                tickFormatter={xAxisFormatter}
              />
              <YAxis
                fontSize="12px"
                color="#666666"
                tickSize="0"
                tickCount="7"
                tickMargin="10"
                domain={["dataMin", "dataMax"]}
                // domain={[
                //   (dataMin) => {
                //     console.log(dataMin);
                //     return dataMin;
                //   },
                //   (dataMax) => {
                //     console.log(dataMax);
                //     return dataMax;
                //   },
                // ]}
                // domain={[0, (dataMax) => Math.ceil(dataMax / 100) * 100 + 200]}
                allowDataOverflow={true}
              />
              <Tooltip isAnimationActive={false} />
              <defs>
                <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#DBEAFE" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="quote"
                fill="url(#gradientArea)"
                stroke="#000000"
                strokeWidth="1.4"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="transaction"
                dot={{
                  fill: "#0081f2",
                  stroke: "white",
                  strokeWidth: 2,
                  r: 7,
                }}
                isAnimationActive={false}
              />
            </ComposedChart>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};
