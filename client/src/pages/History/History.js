import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header/Header";
import { Pagination } from "react-bootstrap";

const History = () => {
  const [stockHistory, setStockHistory] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        const dummyData = [
          { stockSymbol: "AAPL", name: "Apple", purchasePrice: 150, purchaseDate: "2024-01-10", sellPrice: 180, sellDate: "2024-02-10" },
          { stockSymbol: "GOOG", name: "Google", purchasePrice: 2000, purchaseDate: "2024-03-05", sellPrice: 2500, sellDate: "2024-04-01" },
          { stockSymbol: "TSLA", name: "Tesla", purchasePrice: 700, purchaseDate: "2024-06-15", sellPrice: 650, sellDate: "2024-07-15" },
          { stockSymbol: "AMZN", name: "Amazon", purchasePrice: 1000, purchaseDate: "2024-02-20", sellPrice: 1200, sellDate: "2024-03-20" },
          { stockSymbol: "MSFT", name: "Microsoft", purchasePrice: 200, purchaseDate: "2024-04-10", sellPrice: 250, sellDate: "2024-05-10" },
          { stockSymbol: "NFLX", name: "Netflix", purchasePrice: 400, purchaseDate: "2024-07-10", sellPrice: 350, sellDate: "2024-08-01" },
          { stockSymbol: "META", name: "Meta", purchasePrice: 300, purchaseDate: "2024-06-05", sellPrice: 330, sellDate: "2024-07-05" },
          { stockSymbol: "NVDA", name: "NVIDIA", purchasePrice: 500, purchaseDate: "2024-08-10", sellPrice: 600, sellDate: "2024-09-10" },
          { stockSymbol: "AMD", name: "AMD", purchasePrice: 250, purchaseDate: "2024-09-15", sellPrice: 300, sellDate: "2024-10-15" },
          { stockSymbol: "BABA", name: "Alibaba", purchasePrice: 80, purchaseDate: "2024-10-01", sellPrice: 90, sellDate: "2024-11-01" },
        ];

        setStockHistory(dummyData);
      } catch (err) {
        setError("Failed to fetch stock history.");
      }
    };

    fetchStockHistory();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  };

  const calculateProfitLoss = (purchasePrice, sellPrice) => {
    const profitLoss = sellPrice - purchasePrice;
    if (profitLoss > 0) {
      return <span style={{ color: "green" }}>+${profitLoss.toFixed(2)}</span>;
    } else if (profitLoss < 0) {
      return <span style={{ color: "red" }}>-${Math.abs(profitLoss).toFixed(2)}</span>;
    } else {
      return <span>No Profit/Loss</span>;
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = stockHistory.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(stockHistory.length / itemsPerPage);

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h3 className="text-center mb-4">Stock Purchase & Sale History</h3>

        {error && <p className="text-danger">{error}</p>}

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Stock Name</th>
                <th>Purchase Price</th>
                <th>Purchase Date</th>
                <th>Sell Price</th>
                <th>Sell Date</th>
                <th>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.stockSymbol}</td>
                    <td>{transaction.name}</td> {/* Corrected to display the name */}
                    <td>${transaction.purchasePrice.toFixed(2)}</td>
                    <td>{formatDate(transaction.purchaseDate)}</td>
                    <td>${transaction.sellPrice.toFixed(2)}</td>
                    <td>{formatDate(transaction.sellDate)}</td>
                    <td>{calculateProfitLoss(transaction.purchasePrice, transaction.sellPrice)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
      </div>
    </div>
  );
};

export default History;
