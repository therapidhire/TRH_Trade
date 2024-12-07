
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Spinner, Alert, Pagination } from "react-bootstrap";
import Header from "../../components/Header/Header";
import TableComponent from "../../components/Table/Table";

const Position = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page
  const navigate = useNavigate();

  // Simulate fetching stocks data with dummy data
  useEffect(() => {
    const fetchStocks = () => {
      try {
        setTimeout(() => {
          const dummyData = [
            { id: 1, name: "Apple", symbol: "AAPL", quantity: 50, price: 175.5 },
            { id: 2, name: "Tesla", symbol: "TSLA", quantity: 30, price: 272.3 },
            { id: 3, name: "Microsoft", symbol: "MSFT", quantity: 20, price: 315.0 },
            { id: 4, name: "Amazon", symbol: "AMZN", quantity: 15, price: 144.7 },
            { id: 5, name: "Google", symbol: "GOOGL", quantity: 25, price: 137.6 },
            { id: 6, name: "Meta", symbol: "META", quantity: 40, price: 350.1 },
            { id: 7, name: "NVIDIA", symbol: "NVDA", quantity: 10, price: 490.2 },
            { id: 8, name: "Netflix", symbol: "NFLX", quantity: 35, price: 400.5 },
            { id: 9, name: "Adobe", symbol: "ADBE", quantity: 18, price: 570.3 },
            { id: 10, name: "Intel", symbol: "INTC", quantity: 60, price: 34.2 },
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
  const handleTrade = (stock, actionType) => {
    if (actionType === "buy") {
      localStorage.setItem("buy", JSON.stringify(stock));
      navigate(`/trade/buy/${stock.name}`);
    } else if (actionType === "sell") {
      localStorage.setItem("sell", JSON.stringify(stock));
      navigate(`/trade/sell/${stock.name}`);
    }
  };

  const columns = ["Symbol", "Stock Name", "Quantity", "Current Price"];
  const columnKeys = ["symbol", "name", "quantity", "price"];

  // Calculate the stocks to be shown for the current page
  const indexOfLastStock = currentPage * itemsPerPage;
  const indexOfFirstStock = indexOfLastStock - itemsPerPage;
  const currentStocks = stocks.slice(indexOfFirstStock, indexOfLastStock);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(stocks.length / itemsPerPage);

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
          <>
            <TableComponent
              columns={columns}
              columnKeys={columnKeys}
              data={currentStocks}
              buyButtonType="buy"
              sellButtonType="sell"
              onButtonClick={handleTrade}
            />
            {/* Pagination */}
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </>
        ) : (
          <Alert variant="info">No stocks found for this user.</Alert>
        )}
      </div>
    </>
  );
};

export default Position;
