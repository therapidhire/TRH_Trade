import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header/Header";
import { Pagination } from "react-bootstrap";
import axios from "axios";
import "./History.css";

import { useAuth } from "../../context/AuthProvider";

const TRANSACTION_HEADERS = [
  { key: "stockSymbol", label: "Symbol" },
  { key: "stockName", label: "Stock Name" },
  { key: "purchasePrice", label: "Purchase Price" },
  { key: "sellPrice", label: "Sell Price" },
  { key: "purchaseQty", label: "Purchase Qty" },
  { key: "sellQty", label: "Sell Qty" },
  { key: "purchaseAmount", label: "Purchase Amount" },
  { key: "sellAmount", label: "Sell Amount" },
  { key: "profitLoss", label: "Profit/Loss" },
  { key: "profitLossPercentage", label: "Profit/Loss (%)" },
  { key: "age", label: "Age" },
  { key: "purchaseDate", label: "Purchase Date" },
  { key: "sellDate", label: "Sell Date" },
];

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const auth = useAuth();

  const userId = auth.user.userId

  
const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/stock-transactions/transaction/${userId}`
      );
      const transactionsData = response.data;

      const groupedTransactions = transactionsData.reduce(
        (acc, transaction) => {
          const stockId = transaction.StockId;
          if (!acc[stockId]) {
            acc[stockId] = { buy: [], sell: [] };
          }
          acc[stockId][transaction.TransactionType].push(transaction);
          return acc;
        },
        {}
      );

      const stockIds = Object.keys(groupedTransactions);
      const stocksResponse = await axios.post(
        `http://localhost:8080/api/stocks/getStockByIds`,
        { stockIds }
      );
      const stocksMap = stocksResponse.data.reduce((acc, stock) => {
        acc[stock._id] = stock;
        return acc;
      }, {});

      const enhancedTransactions = Object.entries(groupedTransactions).map(
        ([stockId, { buy, sell }]) => {
          const stockData = stocksMap[stockId];

          const totalBuyAmount = buy.reduce(
            (sum, tx) => sum + tx.Price * tx.Quantity,
            0
          );
          const totalBuyQty = buy.reduce((sum, tx) => sum + tx.Quantity, 0);
          const avgBuyPrice = totalBuyQty ? totalBuyAmount / totalBuyQty : 0;

          if (sell.length > 0) {
            const totalSellQty = sell.reduce((sum, tx) => sum + tx.Quantity, 0);
            const sellAmount = sell.reduce(
              (sum, tx) => sum + tx.Price * tx.Quantity,
              0
            );
            const buyForSellQty = avgBuyPrice * totalSellQty;
            const profitLoss = sellAmount - buyForSellQty;
            const profitLossPercentage =
              buyForSellQty > 0
                ? ((profitLoss / buyForSellQty) * 100).toFixed(2)
                : "N/A";

            return {
              stockSymbol: stockData?.Symbol || "N/A",
              stockName: stockData?.StockName || "N/A",
              purchasePrice: avgBuyPrice.toFixed(2),
              purchaseQty: totalBuyQty,
              purchaseAmount: totalBuyAmount.toFixed(2),
              sellPrice: (sellAmount / totalSellQty).toFixed(2),
              sellQty: totalSellQty,
              sellAmount: sellAmount.toFixed(2),
              purchaseDate: buy[0]?.CreatedAt,
              sellDate: sell[sell.length - 1]?.CreatedAt,
              age: calculateAge(
                buy[0]?.CreatedAt,
                sell[sell.length - 1]?.CreatedAt
              ),
              profitLoss: profitLoss.toFixed(2),
              profitLossPercentage,
            };
          }

          return {
            stockSymbol: stockData?.Symbol || "N/A",
            stockName: stockData?.StockName || "N/A",
            purchasePrice: avgBuyPrice.toFixed(2),
            purchaseQty: totalBuyQty,
            purchaseAmount: totalBuyAmount.toFixed(2),
            sellPrice: "Holding",
            sellQty: "0.00",
            sellAmount: "0.00",
            purchaseDate: buy[0]?.CreatedAt,
            sellDate: "N/A",
            age: `Current (${calculateAge(
              buy[0]?.CreatedAt,
              new Date()
            )} days)`,
            profitLoss: "0.00",
            profitLossPercentage: "0.00",
          };
        }
      );

      setTransactions(enhancedTransactions);
    } catch (err) {
      setError("Failed to fetch transactions.");
    }
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const calculateAge = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    return Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transactions.slice(startIndex, startIndex + itemsPerPage);
  }, [transactions, currentPage]);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const formatDate = useCallback((dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  }, []);

  return (
    <div>
      <Header />
      <div className="uperHistoryContainer">
        <div className="historyContainer">
          <h3 className="text-center mb-4">Stock Transaction History</h3>
          {error && <p className="text-danger">{error}</p>}
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  {TRANSACTION_HEADERS.map(({ key, label }) => (
                    <th key={key}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.stockSymbol}</td>
                      <td>{transaction.stockName}</td>
                      <td>{transaction.purchasePrice}</td>
                      <td>{transaction.sellPrice}</td>
                      <td>{transaction.purchaseQty}</td>
                      <td>{transaction.sellQty}</td>
                      <td>{transaction.purchaseAmount}</td>
                      <td>{transaction.sellAmount}</td>
                      <td
                        style={{
                          color:
                            transaction.profitLoss > 0
                              ? "green"
                              : transaction.profitLoss < 0
                              ? "red"
                              : "black",
                        }}
                      >
                        {transaction.profitLoss}
                      </td>
                      <td
                        style={{
                          color:
                            transaction.profitLossPercentage === "0.00"
                              ? "black"
                              : transaction.profitLossPercentage > 0
                              ? "green"
                              : "red",
                        }}
                      >
                        {transaction.profitLossPercentage === "0.00"
                          ? transaction.profitLossPercentage
                          : `${transaction.profitLossPercentage}%`}
                      </td>
                      <td>{transaction.age}</td>
                      <td>{formatDate(transaction.purchaseDate)}</td>
                      <td>{formatDate(transaction.sellDate)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center">
                      No transactions available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
      </div>
    </div>
  );
};

export default History;
