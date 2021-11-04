import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { LoadingIcon } from "./LoadingIcon";

export const StakePieChart = ({ equityPositions, equityValue }) => {
  const [data, setData] = useState([]);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [chartRadius, setChartRadius] = useState(20);

  const colors = [
    "#ECFDF5",
    "#D1FAE5",
    "#A7F3D0",
    "#6EE7B7",
    "#34D399",
    "#10B981",
    "#059669",
    "#047857",
    "#065F46",
    "#064E3B",
  ];
  // const chartRadius = 60;
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, symbol, percent, index }) => {
    if (!isMouseOver) return;
    if (percent < 5) return;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="balck"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="centr"
        fontSize="0.75rem"
      >
        {symbol}: {percent}%
      </text>
    );
  };

  useEffect(() => {
    const tempData = [];
    equityPositions.forEach((position) => {
      const marketValue = Number.parseFloat(position.marketValue);
      const percent = Number.parseFloat(((marketValue / equityValue) * 100).toFixed(1));
      tempData.push({ symbol: position.symbol, marketValue, percent });
    });
    setData(tempData);
  }, []);

  if (!equityPositions || !equityValue)
    return (
      <div className="absolute top-0 left-0">
        <LoadingIcon />
      </div>
    );

  return (
    <div
      onMouseOver={() => {
        setIsMouseOver(true);
        setChartRadius(100);
      }}
      onMouseLeave={() => {
        setIsMouseOver(false);
        setChartRadius(20);
      }}
      className={`${
        isMouseOver ? "opacity-100 shadow-xl" : "opacity-70"
      } absolute top-0 left-0 bg-gray-400 rounded-full p-0.5`}
    >
      <PieChart width={chartRadius * 2} height={chartRadius * 2}>
        {/* <text x={80} y={80} textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="300">
          Stake
        </text> */}
        <Pie
          strokeWidth="0"
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius={0}
          outerRadius={chartRadius}
          fill="#10b882"
          dataKey="percent"
          isAnimationActive={false}
        >
          {equityPositions.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};
