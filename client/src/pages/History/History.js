import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header/Header";
import { Pagination } from "react-bootstrap";
import axios from "axios";
import "./History.css";

const userId = localStorage.getItem("userId");

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Fetch transactions and stock details

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8080/api/stock-transactions/transaction/${userId}`
  //       );
  //       const transactionsData = response.data;

  //       // Group transactions by StockId
  //       const groupedTransactions = transactionsData.reduce((acc, transaction) => {
  //         const stockId = transaction.StockId;
  //         if (!acc[stockId]) {
  //           acc[stockId] = { buy: [], sell: [] };
  //         }
  //         acc[stockId][transaction.TransactionType].push(transaction);
  //         return acc;
  //       }, {});

  //       // Process each stock's grouped transactions
  //       const enhancedTransactions = await Promise.all(
  //         Object.entries(groupedTransactions).map(async ([stockId, { buy, sell }]) => {
  //           try {
  //             const stockResponse = await axios.get(
  //               `http://localhost:8080/api/stocks/${stockId}`
  //             );
  //             const stockData = stockResponse.data;

  //             // Calculate aggregated values
  //             const totalBuyAmount = buy.reduce((sum, tx) => sum + tx.Price * tx.Quantity, 0);
  //             const totalBuyQty = buy.reduce((sum, tx) => sum + tx.Quantity, 0);
  //             const avgBuyPrice = totalBuyQty ? totalBuyAmount / totalBuyQty : 0;

  //             if (sell.length > 0) {
  //               const totalSellAmount = sell.reduce((sum, tx) => sum + tx.Price * tx.Quantity, 0);
  //               const totalSellQty = sell.reduce((sum, tx) => sum + tx.Quantity, 0);
  //               const avgSellPrice = totalSellQty ? totalSellAmount / totalSellQty : 0;

  //               const profitLoss = totalSellAmount - totalBuyAmount;
  //               const profitLossPercentage =
  //                 totalBuyAmount > 0 ? ((profitLoss / totalBuyAmount) * 100).toFixed(2) : "N/A";

  //               return {
  //                 stockSymbol: stockData.Symbol,
  //                 stockName: stockData.StockName,
  //                 purchasePrice: avgBuyPrice.toFixed(2),
  //                 purchaseQty: totalBuyQty,
  //                 purchaseAmount: totalBuyAmount.toFixed(2),
  //                 sellPrice: avgSellPrice.toFixed(2),
  //                 sellQty: totalSellQty,
  //                 sellAmount: totalSellAmount.toFixed(2),
  //                 purchaseDate: buy[0]?.CreatedAt || "N/A",
  //                 sellDate: sell[sell.length - 1]?.CreatedAt || "N/A",
  //                 age: Math.ceil(
  //                   (new Date(sell[sell.length - 1]?.CreatedAt) - new Date(buy[0]?.CreatedAt)) /
  //                     (1000 * 60 * 60 * 24)
  //                 ),
  //                 profitLoss: profitLoss.toFixed(2),
  //                 profitLossPercentage,
  //               };
  //             } else {
  //               return {
  //                 stockSymbol: stockData.Symbol,
  //                 stockName: stockData.StockName,
  //                 purchasePrice: avgBuyPrice.toFixed(2),
  //                 purchaseQty: totalBuyQty,
  //                 purchaseAmount: totalBuyAmount.toFixed(2),
  //                 sellPrice: "N/A",
  //                 sellQty: "N/A",
  //                 sellAmount: "N/A",
  //                 purchaseDate: buy[0]?.CreatedAt || "N/A",
  //                 sellDate: "N/A",
  //                 age: "N/A",
  //                 profitLoss: "N/A",
  //                 profitLossPercentage: "N/A",
  //               };
  //             }
  //           } catch (err) {
  //             console.error("Failed to fetch stock data:", stockId, err);
  //             return { stockSymbol: "N/A", stockName: "N/A" };
  //           }
  //         })
  //       );

  //       setTransactions(enhancedTransactions);
  //     } catch (err) {
  //       setError("Failed to fetch transactions.");
  //     }
  //   };

  //   fetchTransactions();
  // }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/stock-transactions/transaction/${userId}`
        );
        const transactionsData = response.data;

        // Group transactions by StockId
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

        // Process each stock's grouped transactions
        const enhancedTransactions = await Promise.all(
          Object.entries(groupedTransactions).map(
            async ([stockId, { buy, sell }]) => {
              try {
                const stockResponse = await axios.get(
                  `http://localhost:8080/api/stocks/${stockId}`
                );
                const stockData = stockResponse.data;

                // Calculate aggregated values based on sell quantity
                const totalBuyAmount = buy.reduce(
                  (sum, tx) => sum + tx.Price * tx.Quantity,
                  0
                );
                const totalBuyQty = buy.reduce(
                  (sum, tx) => sum + tx.Quantity,
                  0
                );
                const avgBuyPrice = totalBuyQty
                  ? totalBuyAmount / totalBuyQty
                  : 0;

                if (sell.length > 0) {
                  const totalSellQty = sell.reduce(
                    (sum, tx) => sum + tx.Quantity,
                    0
                  );
                  const sellAmount = sell.reduce(
                    (sum, tx) => sum + tx.Price * tx.Quantity,
                    0
                  );

                  // Calculate profit/loss based on sold quantity
                  const buyForSellQty = avgBuyPrice * totalSellQty;
                  const profitLoss = sellAmount - buyForSellQty;
                  const profitLossPercentage =
                    buyForSellQty > 0
                      ? ((profitLoss / buyForSellQty) * 100).toFixed(2)
                      : "N/A";

                  return {
                    stockSymbol: stockData.Symbol,
                    stockName: stockData.StockName,
                    purchasePrice: avgBuyPrice.toFixed(2),
                    purchaseQty: totalBuyQty,
                    purchaseAmount: totalBuyAmount.toFixed(2),
                    sellPrice: (sellAmount / totalSellQty).toFixed(2),
                    sellQty: totalSellQty,
                    sellAmount: sellAmount.toFixed(2),
                    purchaseDate: buy[0]?.CreatedAt || "N/A",
                    sellDate: sell[sell.length - 1]?.CreatedAt || "N/A",
                    age: Math.ceil(
                      (new Date(sell[sell.length - 1]?.CreatedAt) -
                        new Date(buy[0]?.CreatedAt)) /
                        (1000 * 60 * 60 * 24)
                    ),
                    profitLoss: profitLoss.toFixed(2),
                    profitLossPercentage,
                  };
                } else {
                  return {
                    stockSymbol: stockData.Symbol,
                    stockName: stockData.StockName,
                    purchasePrice: avgBuyPrice.toFixed(2),
                    purchaseQty: totalBuyQty,
                    purchaseAmount: totalBuyAmount.toFixed(2),
                    sellPrice: "N/A",
                    sellQty: "N/A",
                    sellAmount: "N/A",
                    purchaseDate: buy[0]?.CreatedAt || "N/A",
                    sellDate: "N/A",
                    age: "N/A",
                    profitLoss: "N/A",
                    profitLossPercentage: "N/A",
                  };
                }
              } catch (err) {
                console.error("Failed to fetch stock data:", stockId, err);
                return { stockSymbol: "N/A", stockName: "N/A" };
              }
            }
          )
        );

        setTransactions(enhancedTransactions);
      } catch (err) {
        setError("Failed to fetch transactions.");
      }
    };

    fetchTransactions();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };
  // console.log(currentData)
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
                  <th>Symbol</th>
                  <th>Stock Name</th>
                  <th>Purchase Price</th>
                  <th>Purchase Qty</th>
                  <th>Purchase Amount</th>
                  <th>Sell Price</th>
                  <th>Sell Qty</th>
                  <th>Sell Amount</th>
                  <th>Purchase Date</th>
                  <th>Sell Date</th>
                  <th>Age</th>
                  <th>Profit/Loss</th>
                  <th>Profit/Loss (%)</th>
                </tr>
              </thead>
              {/* <tbody>
                {currentData.length > 0 ? (
                  currentData.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.stockSymbol}</td>
                      <td>{transaction.stockName}</td>
                      <td>{transaction.purchasePrice}</td>
                      <td>{transaction.purchaseQty}</td>
                      <td>{transaction.purchaseAmount}</td>
                      <td>{transaction.sellPrice}</td>
                      <td>{transaction.sellQty}</td>
                      <td>{transaction.sellAmount}</td>
                      <td>{formatDate(transaction.purchaseDate)}</td>
                      <td>{formatDate(transaction.sellDate)}</td>
                      <td>{transaction.age}</td>
                      <td>{transaction.profitLoss}</td>
                      <td>{transaction.profitLossPercentage}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center">
                      No transactions available.
                    </td>
                  </tr>
                )}
              </tbody> */}

              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.stockSymbol}</td>
                      <td>{transaction.stockName}</td>
                      <td>{transaction.purchasePrice}</td>
                      <td>{transaction.purchaseQty}</td>
                      <td>{transaction.purchaseAmount}</td>
                      <td>{transaction.sellPrice}</td>
                      <td>{transaction.sellQty}</td>
                      <td>{transaction.sellAmount}</td>
                      <td>{formatDate(transaction.purchaseDate)}</td>
                      <td>{formatDate(transaction.sellDate)}</td>
                      <td>{transaction.age}</td>
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
                            transaction.profitLossPercentage > 0
                              ? "green"
                              : transaction.profitLossPercentage < 0
                              ? "red"
                              : "black",
                        }}
                      >
                        {transaction.profitLossPercentage}%
                      </td>
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
    </div>
  );
};

export default History;
