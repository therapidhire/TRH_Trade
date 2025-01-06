// src/components/Graph/Graph.js

import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Graph = ({ type, data, options }) => {
  const renderGraph = () => {
    switch (type) {
      case "bar":
        return <Bar data={data} options={options} />;
      case "line":
        return <Line data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };

  return <div style={{ width: "100%", height: "400px" }}>{renderGraph()}</div>;
};

export default Graph;
