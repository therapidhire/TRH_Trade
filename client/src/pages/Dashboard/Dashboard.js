import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Header from "../../components/Header/Header";

const stocks = [
  { id: 1, name: "Apple", price: 175.5 },
  { id: 2, name: "Tesla", price: 272.3 },
  { id: 3, name: "Microsoft", price: 315.0 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleTrade = (action, stock) => {
    navigate(`/trade/${action}/${stock.name}`);
  };

  return (
    <>
      <Header />
    <div className="dashboard-container">
      <div className="stocks-table-container">
        <table className="stocks-table">
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Current Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id}>
                <td>{stock.name}</td>
                <td>${stock.price}</td>
                <td className="action-buttons-container">
                  <button
                    className="buy-button"
                    onClick={() => handleTrade("buy", stock)}
                  >
                    Buy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
