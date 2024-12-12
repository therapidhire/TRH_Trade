// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Header from "../../components/Header/Header";
// import { Pagination } from "react-bootstrap";
// import "./History.css";
// // import axios from "axios"; // Uncomment when using API

// const userId = localStorage.getItem("userId");

// const History = () => {
//   const [stockHistory, setStockHistory] = useState([]);
//   const [error, setError] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5);

//   useEffect(() => {
//     // Dummy Data for Development
//     const dummyData = [
//       {
//         stockSymbol: "AAPL",
//         name: "Apple",
//         purchasePrice: 150,
//         purchaseQty: 10,
//         sellPrice: 180,
//         sellQty: 10,
//         purchaseDate: "2024-01-10",
//         sellDate: "2024-02-10",
//       },
//       {
//         stockSymbol: "GOOG",
//         name: "Google",
//         purchasePrice: 2000,
//         purchaseQty: 5,
//         sellPrice: 2500,
//         sellQty: 5,
//         purchaseDate: "2024-03-05",
//         sellDate: "2024-04-01",
//       },
//       {
//         stockSymbol: "TSLA",
//         name: "Tesla",
//         purchasePrice: 700,
//         purchaseQty: 3,
//         sellPrice: 650,
//         sellQty: 3,
//         purchaseDate: "2024-06-15",
//         sellDate: "2024-07-15",
//       },
//     ];
//     setStockHistory(dummyData);

//     // API Integration (Comment dummy data above and uncomment below when using API)
//     /*
//     const fetchStockHistory = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/stock/history/getHistory/${userId}`
//         );
//         const res = response.data.data;
//         const filteredData = res.map((history) => ({
//           stockSymbol: history.stockSymbol,
//           name: history.stockName,
//           purchasePrice: history.buyPrice,
//           purchaseQty: history.buyQty,
//           sellPrice: history.sellPrice,
//           sellQty: history.sellQty,
//           purchaseDate: history.buyDate,
//           sellDate: history.sellDate,
//         }));
//         setStockHistory(filteredData);
//       } catch (err) {
//         setError("Failed to fetch stock history.");
//       }
//     };
//     fetchStockHistory();
//     */
//   }, []);

//   const formatDate = (dateString) => {
//     const options = { day: "2-digit", month: "short", year: "numeric" };
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", options);
//   };

//   const calculateAge = (purchaseDate, sellDate) => {
//     const startDate = new Date(purchaseDate);
//     const endDate = new Date(sellDate);
//     const diffTime = Math.abs(endDate - startDate);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return `${diffDays} days`;
//   };

//   const calculateProfitLoss = (purchasePrice, purchaseQty, sellPrice, sellQty) => {
//     const purchaseAmount = purchasePrice * purchaseQty;
//     const sellAmount = sellPrice * sellQty;
//     const profitLoss = sellAmount - purchaseAmount;
//     const profitLossPercentage = ((profitLoss / purchaseAmount) * 100).toFixed(2);

//     return {
//       profitLoss,
//       profitLossPercentage,
//     };
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentData = stockHistory.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const totalPages = Math.ceil(stockHistory.length / itemsPerPage);

//   return (
//     <div>
//       <Header />
//       <div className="uperHistoryContainer">
//         <div className="historyContainer">
//           <h3 className="text-center mb-4">Stock Purchase & Sale History</h3>

//           {error && <p className="text-danger">{error}</p>}

//           <div className="table-responsive">
//             <table className="table table-bordered table-striped">
//               <thead>
//                 <tr>
//                   <th>Symbol</th>
//                   <th>Stock Name</th>
//                   <th>Purchase Price</th>
//                   <th>Purchase Qty</th>
//                   <th>Purchase Amount</th>
//                   <th>Sell Price</th>
//                   <th>Sell Qty</th>
//                   <th>Sell Amount</th>
//                   <th>Purchase Date</th>
//                   <th>Sell Date</th>
//                   <th>Age</th>
//                   <th>Profit/Loss</th>
//                   <th>Profit/Loss (%)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentData.length > 0 ? (
//                   currentData.map((transaction, index) => {
//                     const { profitLoss, profitLossPercentage } = calculateProfitLoss(
//                       transaction.purchasePrice,
//                       transaction.purchaseQty,
//                       transaction.sellPrice,
//                       transaction.sellQty
//                     );
//                     const age = calculateAge(transaction.purchaseDate, transaction.sellDate);

//                     return (
//                       <tr key={index}>
//                         <td>{transaction.stockSymbol}</td>
//                         <td>{transaction.name}</td>
//                         <td>{transaction.purchasePrice}</td>
//                         <td>{transaction.purchaseQty}</td>
//                         <td>{(transaction.purchasePrice * transaction.purchaseQty).toFixed(2)}</td>
//                         <td>{transaction.sellPrice}</td>
//                         <td>{transaction.sellQty}</td>
//                         <td>{(transaction.sellPrice * transaction.sellQty).toFixed(2)}</td>
//                         <td>{formatDate(transaction.purchaseDate)}</td>
//                         <td>{formatDate(transaction.sellDate)}</td>
//                         <td>{age}</td>
//                         <td style={{ color: profitLoss >= 0 ? "green" : "red" }}>
//                           {profitLoss >= 0 ? "+" : ""}
//                           {profitLoss.toFixed(2)}
//                         </td>
//                         <td style={{ color: profitLoss >= 0 ? "green" : "red" }}>
//                           {profitLossPercentage >= 0 ? "+" : ""}
//                           {profitLossPercentage}%
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="13" className="text-center">
//                       No history available.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <Pagination>
//             <Pagination.Prev
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//             />
//             {[...Array(totalPages)].map((_, index) => (
//               <Pagination.Item
//                 key={index + 1}
//                 active={index + 1 === currentPage}
//                 onClick={() => handlePageChange(index + 1)}
//               >
//                 {index + 1}
//               </Pagination.Item>
//             ))}
//             <Pagination.Next
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             />
//           </Pagination>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default History;





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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/stock-transactions/transaction/${userId}`);
        const data = response.data;
        console.log("history table in:- ", data)
        // Group transactions by stock symbol
        const groupedData = data.reduce((acc, transaction) => {
          const Symbol = transaction.Symbol;
          if (!acc[Symbol]) {
            acc[Symbol] = [];
          }
          acc[Symbol].push(transaction);
          return acc;
        }, {});

        // Process grouped transactions to pair buy and sell
        const processedData = Object.values(groupedData).flatMap((group) => {
          const buyTransactions = group.filter((t) => t.type === "buy");
          const sellTransactions = group.filter((t) => t.type === "sell");

          const pairedTransactions = [];

          for (let i = 0; i < buyTransactions.length; i++) {
            const buy = buyTransactions[i];
            const sell = sellTransactions.find((s) => s.date > buy.date);

            if (sell) {
              pairedTransactions.push({
                stockSymbol: buy.Symbol,
                name: buy.StockName,
                purchasePrice: buy.Price,
                purchaseQty: buy.Quantity,
                sellPrice: sell.Price,
                sellQty: sell.Quantity,
                purchaseDate: buy.date,
                sellDate: sell.date,
              });

              // Remove the matched sell transaction to prevent duplicate pairing
              const sellIndex = sellTransactions.indexOf(sell);
              sellTransactions.splice(sellIndex, 1);
            }
          }

          return pairedTransactions;
        });

        setTransactions(processedData);
      } catch (err) {
        setError("Failed to fetch transactions.");
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  };

  const calculateAge = (purchaseDate, sellDate) => {
    const startDate = new Date(purchaseDate);
    const endDate = new Date(sellDate);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const calculateProfitLoss = (purchasePrice, purchaseQty, sellPrice, sellQty) => {
    const purchaseAmount = purchasePrice * purchaseQty;
    const sellAmount = sellPrice * sellQty;
    const profitLoss = sellAmount - purchaseAmount;
    const profitLossPercentage = ((profitLoss / purchaseAmount) * 100).toFixed(2);

    return {
      profitLoss,
      profitLossPercentage,
    };
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  return (
    <div>
      <Header />
      <div className="uperHistoryContainer">
        <div className="historyContainer">
          <h3 className="text-center mb-4">Stock Purchase & Sale History</h3>

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
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((transaction, index) => {
                    const { profitLoss, profitLossPercentage } = calculateProfitLoss(
                      transaction.purchasePrice,
                      transaction.purchaseQty,
                      transaction.sellPrice,
                      transaction.sellQty
                    );
                    const age = calculateAge(transaction.purchaseDate, transaction.sellDate);

                    return (
                      <tr key={index}>
                        <td>{transaction.stockSymbol}</td>
                        <td>{transaction.name}</td>
                        <td>{transaction.purchasePrice}</td>
                        <td>{transaction.purchaseQty}</td>
                        <td>{(transaction.purchasePrice * transaction.purchaseQty).toFixed(2)}</td>
                        <td>{transaction.sellPrice}</td>
                        <td>{transaction.sellQty}</td>
                        <td>{(transaction.sellPrice * transaction.sellQty).toFixed(2)}</td>
                        <td>{formatDate(transaction.purchaseDate)}</td>
                        <td>{formatDate(transaction.sellDate)}</td>
                        <td>{age}</td>
                        <td style={{ color: profitLoss >= 0 ? "green" : "red" }}>
                          {profitLoss >= 0 ? "+" : ""}
                          {profitLoss.toFixed(2)}
                        </td>
                        <td style={{ color: profitLoss >= 0 ? "green" : "red" }}>
                          {profitLossPercentage >= 0 ? "+" : ""}
                          {profitLossPercentage}%
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center">
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
    </div>
  );
};

export default History;

