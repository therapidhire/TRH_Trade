// src/components/Graphs/Graphs.js
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF7300", "#82ca9d", "#8884d8"];

const Graphs = ({ data, chartType }) => {
  // Prepare data for graphs
  const graphData = data.map((transaction) => (console.log(transaction),{
    
    stockName: transaction.stockSymbol,
    purchaseAmount: parseFloat(transaction.purchaseAmount),
    sellAmount: transaction.sellAmount !== "N/A" ? parseFloat(transaction.sellAmount) : 0,
    profitLoss: transaction.profitLoss !== "N/A" ? parseFloat(transaction.profitLoss) : 0,
    profitLossPercentage:
      transaction.profitLossPercentage !== "N/A" ? parseFloat(transaction.profitLossPercentage) : 0,
  }));

  // Define a reusable function for rendering graphs
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={graphData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stockName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="purchaseAmount" fill="#8884d8" name="Purchase Amount" />
              <Bar dataKey="sellAmount" fill="#82ca9d" name="Sell Amount" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={graphData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stockName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profitLoss" stroke="#ff7300" name="Profit/Loss" />
              <Line
                type="monotone"
                dataKey="profitLossPercentage"
                stroke="#387908"
                name="Profit/Loss (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={graphData}
                dataKey="profitLoss"
                nameKey="stockName"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {graphData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <p>Invalid chart type specified</p>;
    }
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h4 className="text-center">Trading Behavior Overview</h4>
      {renderChart()}
    </div>
  );
};

export default Graphs;
