import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Pagination } from "react-bootstrap";
import Header from "../../components/Header/Header";
import axios from "axios";
import "../Position/Positions.css";
import "../Holding/Holding.css";
import axiosInstance from "../../components/Axios/interseptor";
import { useAuth } from "../../context/AuthProvider";

const Holdings = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  // const userId = localStorage.getItem("userId");
  const userId = auth.user.userId;
  const itemsPerPage = 10;

  const columns = [
    "Symbol",
    "Holding Name",
    "Quantity",
    "Price",
    "Total Amount",
    "Age",
    "Actions",
  ];

  const columnKeys = [
    "symbol",
    "name",
    "quantity",
    "price",
    "totalPrice",
    "age",
  ];

  const [positions, setPositions] = useState([]);
  const [holdingNameFilter, setHoldingNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ column: null, order: "asc" });

  const calculateAge = (purchaseDate) => {
    const currentDate = new Date();
    const purchase = new Date(purchaseDate);
    return Math.ceil((currentDate - purchase) / (1000 * 60 * 60 * 24));
  };

  const fetchPositions = useCallback(async () => {
    try {
      const transactionResponse = await axiosInstance.get(
        `/stock-transactions/transaction/${userId}`
      );

      const filtered = transactionResponse.data.filter(
        (position) =>
          position.CreatedBy === userId && position.TransactionType === "buy"
      );
      const allStockIds = filtered.map((position) => position.StockId);
      const getStocksResponce = await axiosInstance.post(
        `/stocks/getStockByIds`,
        { stockIds: allStockIds }
      );
      const getAllStoks = getStocksResponce.data;

      const formattedPositionss = filtered
        ?.map((stock) => {
          const age = calculateAge(stock.CreatedAt);
          if (age <= 1) return null;

          const stockDetails = getAllStoks.find((s) => s._id === stock.StockId);

          if (stockDetails) {
            return {
              StockId: stock?.StockId,
              symbol: stockDetails?.Symbol,
              name: stockDetails?.StockName,
              quantity: stock?.Quantity,
              price: stock?.Price,
              totalPrice: (stock?.Quantity * stock?.Price).toFixed(2),
              age: `${age} days`,
            };
          }
          return null;
        })
        .filter(Boolean);

      setPositions(formattedPositionss);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const filteredPositions = useMemo(() => {
    let result = [...positions];

    if (holdingNameFilter) {
      result = result.filter((position) =>
        position.name.toLowerCase().includes(holdingNameFilter.toLowerCase())
      );
    }

    if (sortConfig.column) {
      result.sort((a, b) => {
        let compareA = a[sortConfig.column];
        let compareB = b[sortConfig.column];

        if (sortConfig.column === "totalPrice") {
          compareA = parseFloat(compareA);
          compareB = parseFloat(compareB);
        }

        if (sortConfig.column === "age") {
          compareA = parseInt(compareA.split(" ")[0]);
          compareB = parseInt(compareB.split(" ")[0]);
        }

        if (typeof compareA === "number" && typeof compareB === "number") {
          return sortConfig.order === "asc"
            ? compareA - compareB
            : compareB - compareA;
        }

        return sortConfig.order === "asc"
          ? String(compareA).localeCompare(String(compareB))
          : String(compareB).localeCompare(String(compareA));
      });
    }

    return result;
  }, [positions, holdingNameFilter, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPositions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPositions, currentPage]);

  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);

  const handleTrade = useCallback(
    async (stock, actionType) => {
      try {
        const getStocksResponce = await axiosInstance.get(
          `/stocks/${stock.StockId}`
        );
        const stockData = getStocksResponce?.data || stock;
        localStorage.setItem(actionType, JSON.stringify(stockData));
        navigate(`/trade/${actionType}/${stock.name}`);
      } catch (error) {
        console.error(`Error handling ${actionType}:`, error);
      }
    },
    [navigate]
  );

  const handleSort = useCallback((column, index) => {
    if (index === columns.length - 1) return;
    setSortConfig((current) => ({
      column,
      order:
        current.column === column && current.order === "asc" ? "desc" : "asc",
    }));
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Holdings</h2>

        {/* <table className="table table-bordered"> */}

        <div className="dashboard-searchbar">
          <input
            type="text"
            placeholder="Filter by Holding name"
            value={holdingNameFilter}
            onChange={(e) => setHoldingNameFilter(e.target.value)}
          />
        </div>
        <table className="table table-bordered ">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(columnKeys[index], index)}
                  style={{ cursor: "pointer" }}
                >
                  {column}
                  {sortConfig.column === columnKeys[index] &&
                    (sortConfig.order === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((position, index) => (
              <tr key={index}>
                <td>{position.symbol}</td>
                <td>{position.name}</td>
                <td>{position.quantity}</td>
                <td>
                  {position.price ? Number(position.price).toFixed(2) : "N/A"}
                </td>
                <td>{position.totalPrice}</td>
                <td>{position.age}</td>
                <td>
                  <button
                    className="actionBtn"
                    style={{ backgroundColor: "rgb(29, 128, 241)" }}
                    onClick={() => handleTrade(position, "buy")}
                  >
                    Buy
                  </button>
                  <button
                    className="actionBtn"
                    style={{ backgroundColor: "#f57300" }}
                    onClick={() => handleTrade(position, "sell")}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination>
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </>
  );
};

export default Holdings;
