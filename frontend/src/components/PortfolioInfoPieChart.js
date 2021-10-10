import { PieChart, Pie, Cell, Tooltip } from "recharts";

const PortfolioInfoPieChart = ({ data, totalValue }) => {
  if (!data) {
    return <div className="flex items-center justify-center bg-white rounded-xl">Data not available</div>;
  }

  const chartData = [];
  data.map((d) => {
    chartData.push({ name: d.name, percent: Number.parseFloat(((d.value / totalValue) * 100).toFixed(0)) });
  });

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 1) {
      return null;
    }

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${name}: ${percent}%`}
      </text>
    );
  };

  const COLORS = ["#10B981", "#34D399"];

  return (
    // https://recharts.org/en-US/examples/PieChartWithCustomizedLabel

    <div className="flex flex-col items-center justify-center p-1 bg-white rounded-xl">
      <div>
        <PieChart width={300} height={300}>
          {totalValue}
          <Pie
            dataKey="percent"
            data={chartData}
            // cx="50%"
            // cy="50%"
            outerRadius={120}
            fill="#10b882"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <Tooltip />
      </div>
    </div>
  );
};

export default PortfolioInfoPieChart;
