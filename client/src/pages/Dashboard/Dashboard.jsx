import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Table, Pagination } from "react-bootstrap";
import Header from "../../components/Header/Header";
import axiosInstance from "../../components/Axios/interseptor";
// import { toast } from 'react-toastify';
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State management with proper initialization
  const [stocks, setStocks] = useState([]);
  const [stockNameFilter, setStockNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  // const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const MAX_PAGE_BUTTONS = 10;

  // Memoized fetch function
  const fetchStocks = useCallback(async () => {
    // setIsLoading(true);
    try {
      const { data } = await axiosInstance.get("/stocks");
      const formattedStocks = data.map(stock => ({
        stockId: stock._id,
        symbol: stock.Symbol || "N/A",
        name: stock.StockName || "N/A",
        isinNumber: stock.ISINNumber,
      }));
      setStocks(formattedStocks);
    } catch (error) {
      // toast.error("Failed to fetch stocks data");
      console.error("Stock fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    return () => setStocks([]); // Cleanup
  }, [fetchStocks]);

  // Memoized trade handler
  const handleTrade = useCallback(async (stock, actionType) => {
    try {
      const { data: stockData } = await axiosInstance.get(`/stocks/${stock.stockId}`);
      console.log("stockData", stockData);
      console.log("stock", stock);
      
      localStorage.setItem(actionType, JSON.stringify(stockData || stock));
      navigate(`/trade/${actionType}/${stock.name}`);
    } catch (error) {
      console.error(`Error handling ${actionType} for stock:`, error);
    }
  }, [navigate]);

  // Memoized sort handler
  const handleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ascending" 
        ? "descending" 
        : "ascending"
    }));
  }, []);

  // Memoized filtered and sorted stocks
  const processedStocks = useMemo(() => {
    let result = [...stocks];
    
    // Filter
    if (stockNameFilter) {
      result = result.filter(stock => 
        stock.name.toLowerCase().includes(stockNameFilter.toLowerCase())
      );
    }
    
    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const direction = sortConfig.direction === "ascending" ? 1 : -1;
        return a[sortConfig.key].localeCompare(b[sortConfig.key]) * direction;
      });
    }
    
    return result;
  }, [stocks, stockNameFilter, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(processedStocks.length / ITEMS_PER_PAGE);
  const currentStocks = processedStocks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Pagination renderer
  const renderPagination = useCallback(() => {
    const startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
    const endPage = Math.min(totalPages, startPage + MAX_PAGE_BUTTONS - 1);

    return (
      <Pagination className="justify-content-center">
        <Pagination.First
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
        />
        {startPage > 1 && <Pagination.Ellipsis disabled />}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
          <Pagination.Item
            key={startPage + i}
            active={startPage + i === currentPage}
            onClick={() => setCurrentPage(startPage + i)}
          >
            {startPage + i}
          </Pagination.Item>
        ))}
        {endPage < totalPages && <Pagination.Ellipsis disabled />}
        <Pagination.Next
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  }, [currentPage, totalPages]);

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Stock Market Dashboard</h2>

        <div className="dashboard-searchbar">
          <label className="fw-bold">Filter by Stock Name</label>
          <input
            type="text"
            placeholder="Enter stock name"
            value={stockNameFilter}
            onChange={(e) => setStockNameFilter(e.target.value)}
            className="form-control"
          />
        </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th onClick={() => handleSort("symbol")} className="sortable-header">
                  Symbol {sortConfig.key === "symbol" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("name")} className="sortable-header">
                  Stock Name {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStocks.map((stock) => (
                <tr key={stock.isinNumber}>
                  <td>{stock.symbol}</td>
                  <td>{stock.name}</td>
                  <td>
                    <button
                      className="actionBtn"
                      style={{ backgroundColor: "rgb(29, 128, 241)" }}
                      onClick={() => handleTrade(stock, "buy")}
                    >
                      Buy
                    </button>
                    <button
                      className="actionBtn"
                      style={{ backgroundColor: "#f57300" }}
                      onClick={() => handleTrade(stock, "sell")}
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

        {renderPagination()}
      </div>
    </>
  );
};

export default Dashboard;
