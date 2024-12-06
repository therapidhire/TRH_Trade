
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import Header from "../../components/Header/Header";
import TableComponent from "../../components/Table/Table";

const Position = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Simulate fetching stocks data with dummy data
  useEffect(() => {
    const fetchStocks = () => {
      try {
        // Simulating a delay to mimic API call
        setTimeout(() => {
          const dummyData = [
            { id: 1, name: "Apple", quantity: 50, price: 175.5 },
            { id: 2, name: "Tesla", quantity: 30, price: 272.3 },
            { id: 3, name: "Microsoft", quantity: 20, price: 315.0 },
            { id: 4, name: "Amazon", quantity: 15, price: 144.7 },
            { id: 5, name: "Google", quantity: 25, price: 137.6 },
            { id: 6, name: "Meta", quantity: 40, price: 350.1 },
            { id: 7, name: "NVIDIA", quantity: 10, price: 490.2 },
            { id: 8, name: "Netflix", quantity: 35, price: 400.5 },
            { id: 9, name: "Adobe", quantity: 18, price: 570.3 },
            { id: 10, name: "Intel", quantity: 60, price: 34.2 },
          ];
          setStocks(dummyData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch stocks. Please try again later.");
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Handle redirect to sell page
  const handleSell = (stock) => {
    navigate(`/trade/sell/${stock.name}`);
  };

  const columns = ["Stock Name", "Quantity", "Current Price"];
  const columnKeys = ["name", "quantity", "price"]


  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Stocks</h2>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : stocks.length > 0 ? (
            <TableComponent
            columns={columns}
            columnKeys={columnKeys}
            data={stocks}
            buttonType="sell"
            onButtonClick={handleSell}
          />
        ) : (
          <Alert variant="info">No stocks found for this user.</Alert>
        )}
      </div>
    </>
  );
};

export default Position;
