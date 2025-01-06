import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Table, Pagination } from "react-bootstrap";
import Header from "../../components/Header/Header";
import axios from "axios";
import '../Position/Positions.css'

const Dashboard = () => {
  const navigate = useNavigate();

  // Local state
  const [stocks, setStocks] = useState([]);
  const [stockNameFilter, setStockNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const itemsPerPage = 10;
  const maxPageButtons = 10;
  const remainingMoney = 5000; // Example remaining amount for display

  // Fetch stock data
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stockResponse = await axios.get("http://localhost:8080/api/stocks");
        const stockData = stockResponse?.data || [];
        const formattedStocks = stockData.map((stockEntry) => ({
          stockId: stockEntry._id,
          symbol: stockEntry.Symbol || "N/A",
          name: stockEntry.StockName || "N/A",
          isinNumber: stockEntry.ISINNumber,
        }));
        console.log("get all stock in dashboard:- ", formattedStocks[0]);
        setStocks(formattedStocks);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStocks();
  }, []);

  // Handle trade actions (buy/sell)
  const handleTrade = async (stock, actionType) => {

    console.log("stock in das:-- ", stock);
    try {
      const response = await axios.get(`http://localhost:8080/api/stocks/${stock.stockId}`);
      const stockData = response?.data;

      console.log("Single Stock Details in Dashboard:- ", stockData)

      if (stockData == null) {
        localStorage.setItem(actionType, JSON.stringify(stock));
      } else {
        localStorage.setItem(actionType, JSON.stringify(stockData));
      }
      navigate(`/trade/${actionType}/${stock.name}`);
    } catch (error) {
      console.error(`Error handling ${actionType} for stock:`, error);
    }
  };

  // Sort stocks
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });

    const sortedStocks = [...stocks].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setStocks(sortedStocks);
  };

  // Filter stocks by name
  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(stockNameFilter.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const currentStocks = filteredStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination>
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {startPage > 1 && <Pagination.Ellipsis disabled />}
        {pageNumbers}
        {endPage < totalPages && <Pagination.Ellipsis disabled />}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Stock Market Dashboard</h2>

        <div className="d-flex justify-content-between mb-4">
          <Form className="w-50">
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Filter by Stock Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter stock name"
                    value={stockNameFilter}
                    onChange={(e) => setStockNameFilter(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <div>
            {/* <strong>Remaining Money:</strong>
            <p className="text-success">${remainingMoney.toFixed(2)}</p> */}
          </div>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("symbol")}
                style={{ cursor: "pointer" }}
              >
                Symbol {" "}
                {sortConfig.key === "symbol" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer" }}
              >
                Stock Name {" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
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
                    style={{
                      // fontWeight: "bold",
                      backgroundColor:"rgb(29, 128, 241)"
                    }}
                    onClick={() => handleTrade(stock, "buy")}
                  >
                    Buy
                  </button>
                  <button
                    className="actionBtn"
                    style={{
                      backgroundColor: "#f57300"
                    }}
                    onClick={() => handleTrade(stock, "sell")}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center mt-4">
          {renderPagination()}
        </div>
      </div>
    </>
  );
};

export default Dashboard;






// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Form, Row, Col, Table, Pagination, Modal, Button } from "react-bootstrap";
// import Header from "../../components/Header/Header";
// import axios from "axios";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   // Local state
//   const [stocks, setStocks] = useState([]);
//   const [stockNameFilter, setStockNameFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState("");

//   const itemsPerPage = 10;
//   const maxPageButtons = 10;
//   const remainingMoney = 5000; // Example remaining amount for display

//   // Fetch stock data
//   useEffect(() => {
//     const fetchStocks = async () => {
//       try {
//         const stockResponse = await axios.get("http://localhost:8080/api/stocks");
//         const stockData = stockResponse?.data || [];
//         const formattedStocks = stockData.map((stockEntry) => ({
//           stockId: stockEntry._id,
//           symbol: stockEntry.Symbol || "N/A",
//           name: stockEntry.StockName || "N/A",
//           isinNumber: stockEntry.ISINNumber,
//         }));
//         console.log("get all stock in dashboard:- ", formattedStocks[0]);
//         setStocks(formattedStocks);
//       } catch (error) {
//         console.error("Error fetching stock data:", error);
//       }
//     };

//     fetchStocks();
//   }, []);

//   // Handle trade actions (buy/sell)
//   const handleTrade = async (stock, actionType) => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/stocks/${stock.stockId}`);
//       const stockData = response?.data;

//       console.log("Single Stock Details in Dashboard:- ", stockData);

//       const stockResponse = await axios.get(
//         `http://localhost:8080/api/stock-transactions/${stock.stockId}`
//       );
//       console.log("stockResponse error:---",stockResponse.found);

//       if (!stockData.found) {
//         alert("No stock transactions found!");
//         return; // Exit early if no data is found
//     }

//       if (stockData == null) {
//         localStorage.setItem(actionType, JSON.stringify(stock));
//       } else {
//         localStorage.setItem(actionType, JSON.stringify(stockData));
//       }
//       navigate(`/trade/${actionType}/${stock.name}`);
//     } catch (error) {
//       console.error(`Error handling ${actionType} for stock:`, error);
//     }
//   };

//   // Sort stocks
//   const handleSort = (key) => {
//     const direction =
//       sortConfig.key === key && sortConfig.direction === "ascending"
//         ? "descending"
//         : "ascending";
//     setSortConfig({ key, direction });

//     const sortedStocks = [...stocks].sort((a, b) => {
//       if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
//       if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
//       return 0;
//     });

//     setStocks(sortedStocks);
//   };

//   // Filter stocks by name
//   const filteredStocks = stocks.filter((stock) =>
//     stock.name.toLowerCase().includes(stockNameFilter.toLowerCase())
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
//   const currentStocks = filteredStocks.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

//   const renderPagination = () => {
//     const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
//     const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

//     const pageNumbers = [];
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <Pagination.Item
//           key={i}
//           active={i === currentPage}
//           onClick={() => handlePageChange(i)}
//         >
//           {i}
//         </Pagination.Item>
//       );
//     }

//     return (
//       <Pagination>
//         <Pagination.First
//           onClick={() => handlePageChange(1)}
//           disabled={currentPage === 1}
//         />
//         <Pagination.Prev
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         />
//         {startPage > 1 && <Pagination.Ellipsis disabled />}
//         {pageNumbers}
//         {endPage < totalPages && <Pagination.Ellipsis disabled />}
//         <Pagination.Next
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         />
//         <Pagination.Last
//           onClick={() => handlePageChange(totalPages)}
//           disabled={currentPage === totalPages}
//         />
//       </Pagination>
//     );
//   };

//   return (
//     <>
//       <Header />
//       <div className="container mt-5">
//         <h2 className="text-center mb-4">Stock Market Dashboard</h2>

//         <div className="d-flex justify-content-between mb-4">
//           <Form className="w-50">
//             <Row>
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Filter by Stock Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter stock name"
//                     value={stockNameFilter}
//                     onChange={(e) => setStockNameFilter(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Form>
//           <div>
//             <strong>Remaining Money:</strong>
//             <p className="text-success">${remainingMoney.toFixed(2)}</p>
//           </div>
//         </div>

//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th
//                 onClick={() => handleSort("symbol")}
//                 style={{ cursor: "pointer" }}
//               >
//                 Symbol{" "}
//                 {sortConfig.key === "symbol" &&
//                   (sortConfig.direction === "ascending" ? "↑" : "↓")}
//               </th>
//               <th
//                 onClick={() => handleSort("name")}
//                 style={{ cursor: "pointer" }}
//               >
//                 Stock Name{" "}
//                 {sortConfig.key === "name" &&
//                   (sortConfig.direction === "ascending" ? "↑" : "↓")}
//               </th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentStocks.map((stock) => (
//               <tr key={stock.isinNumber}>
//                 <td>{stock.symbol}</td>
//                 <td>{stock.name}</td>
//                 <td>
//                   <button
//                     className="btn btn-primary me-2"
//                     onClick={() => handleTrade(stock, "buy")}
//                   >
//                     Buy
//                   </button>
//                   <button
//                     className="btn"
//                     style={{
//                       backgroundColor: "#f57300",
//                       fontWeight: "bold",
//                       color: "white",
//                     }}
//                     onClick={() => handleTrade(stock, "sell")}
//                   >
//                     Sell
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>

//         <div className="d-flex justify-content-center mt-4">
//           {renderPagination()}
//         </div>
//       </div>

//       {/* Modal for Popup */}
//       <Modal show={showPopup} onHide={() => setShowPopup(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Information</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{popupMessage}</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowPopup(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default Dashboard;

