import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Holding.css";
import Header from "../../components/Header/Header";

const userHoldings = [
  { id: 1, name: "Apple", quantity: 50, price: 175.5 },
  { id: 2, name: "Tesla", quantity: 30, price: 272.3 },
  { id: 3, name: "Microsoft", quantity: 20, price: 315.0 },
];

const Holding = () => {
  const [holdings, setHoldings] = useState(userHoldings);
  const navigate = useNavigate();

  const handleSell = (stock) => {
    navigate(`/trade/sell/${stock.name}`);
  };

  const calculateTotalValue = () => {
    return holdings.reduce((total, stock) => total + stock.quantity * stock.price, 0).toFixed(2);
  };

  return (
    <>
    <Header/>
    <div className="holding-container">
      <h2>Your Stock Holdings</h2>
      <div className="portfolio-value">
        <strong>Total Portfolio Value:</strong> ${calculateTotalValue()}
      </div>
      <table className="holdings-table">
        <thead>
          <tr>
            <th>Stock Name</th>
            <th>Quantity</th>
            <th>Current Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.name}</td>
              <td>{stock.quantity}</td>
              <td>${stock.price}</td>
              <td>
                <button
                  className="sell-button"
                  onClick={() => handleSell(stock)}
                >
                  Sell
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Holding;
