// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Form, Row, Col, Pagination } from "react-bootstrap";
// import Header from "../../components/Header/Header";
// import TableComponent from "../../components/Table/Table";
// import { setHoldings, filterHoldings } from "../../redux/slices/holdingsSlice";

// const HoldingsDashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const holdings = useSelector((state) => state.holdings.filteredHoldings || []);
//   const [holdingNameFilter, setHoldingNameFilter] = useState("");
//   const [quantityRangeFilter, setQuantityRangeFilter] = useState({ min: 0, max: Infinity });
//   const [remainingMoney] = useState(5000);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     const fetchedHoldings = [
//       { id: 1, name: "Apple", symbol: "AAPL", quantity: 50, price: 175.5 },
//       { id: 2, name: "Tesla", symbol: "TSLA", quantity: 30, price: 272.3 },
//       { id: 3, name: "Microsoft", symbol: "MSFT", quantity: 20, price: 315.0 },
//       { id: 4, name: "Amazon", symbol: "AMZN", quantity: 15, price: 144.7 },
//       { id: 5, name: "Google", symbol: "GOOGL", quantity: 25, price: 137.6 },
//       { id: 6, name: "Meta", symbol: "META", quantity: 40, price: 350.1 },
//       { id: 7, name: "NVIDIA", symbol: "NVDA", quantity: 10, price: 490.2 },
//       { id: 8, name: "Netflix", symbol: "NFLX", quantity: 35, price: 400.5 },
//       { id: 9, name: "Adobe", symbol: "ADBE", quantity: 18, price: 570.3 },
//       { id: 10, name: "Intel", symbol: "INTC", quantity: 60, price: 34.2 },
//     ];

//     dispatch(setHoldings(fetchedHoldings));
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(
//       filterHoldings({
//         nameFilter: holdingNameFilter,
//         quantityRange: quantityRangeFilter,
//       })
//     );
//   }, [holdingNameFilter, quantityRangeFilter, dispatch]);

//   const handleTrade = (stock, actionType) => {
//     if (actionType === "buy") {
//       localStorage.setItem("buy", JSON.stringify(stock));
//       navigate(`/trade/buy/${stock.name}`);
//     } else if (actionType === "sell") {
//       localStorage.setItem("sell", JSON.stringify(stock));
//       navigate(`/trade/sell/${stock.name}`);
//     }
//   };

//   const columns = ["Symbol", "Holding Name", "Quantity", "Current Price"];
//   const columnKeys = ["symbol", "name", "quantity", "price"];

//   // Calculate the stocks to be shown for the current page
//   const indexOfLastHolding = currentPage * itemsPerPage;
//   const indexOfFirstHolding = indexOfLastHolding - itemsPerPage;
//   const currentHoldings = holdings.slice(indexOfFirstHolding, indexOfLastHolding);

//   const totalPages = Math.ceil(holdings.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <>
//       <Header />
//       <div className="container mt-5">
//         <h2 className="text-center mb-4">Your Holdings</h2>

//         <Row>
//           <Col sm={6}>
//             <Form.Control
//               type="text"
//               placeholder="Filter by holding name"
//               value={holdingNameFilter}
//               onChange={(e) => setHoldingNameFilter(e.target.value)}
//             />
//           </Col>
//           {/* <Col sm={6}>
//             <Form.Control
//               type="number"
//               placeholder="Min Quantity"
//               value={quantityRangeFilter.min}
//               onChange={(e) => setQuantityRangeFilter({ ...quantityRangeFilter, min: e.target.value })}
//             />
//           </Col> */}
//         </Row>

//         <TableComponent
//           columns={columns}
//           columnKeys={columnKeys}
//           data={currentHoldings}
//           buyButtonType="buy"
//           sellButtonType="sell"
//           onButtonClick={handleTrade}
//         />

//         {/* Pagination */}
//         <Pagination>
//           <Pagination.Prev
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           />
//           {[...Array(totalPages)].map((_, index) => (
//             <Pagination.Item
//               key={index + 1}
//               active={index + 1 === currentPage}
//               onClick={() => handlePageChange(index + 1)}
//             >
//               {index + 1}
//             </Pagination.Item>
//           ))}
//           <Pagination.Next
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           />
//         </Pagination>
//       </div>
//     </>
//   );
// };

// export default HoldingsDashboard;






import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Pagination } from "react-bootstrap";
import Header from "../../components/Header/Header";
import TableComponent from "../../components/Table/Table";
import { setHoldings, filterHoldings } from "../../redux/slices/holdingsSlice";

const HoldingsDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const holdings = useSelector((state) => state.holdings.filteredHoldings || []);
  const [holdingNameFilter, setHoldingNameFilter] = useState("");
  const [quantityRangeFilter, setQuantityRangeFilter] = useState({ min: 0, max: Infinity });
  const [remainingMoney] = useState(5000);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchedHoldings = [
      { id: 1, name: "Apple", symbol: "AAPL", quantity: 50, price: 175.5, purchaseDate: "2024-01-01" },
      { id: 2, name: "Tesla", symbol: "TSLA", quantity: 30, price: 272.3, purchaseDate: "2023-12-15" },
      { id: 3, name: "Microsoft", symbol: "MSFT", quantity: 20, price: 315.0, purchaseDate: "2024-02-10" },
      { id: 4, name: "Amazon", symbol: "AMZN", quantity: 15, price: 144.7, purchaseDate: "2023-11-01" },
      { id: 5, name: "Google", symbol: "GOOGL", quantity: 25, price: 137.6, purchaseDate: "2024-01-15" },
      { id: 6, name: "Meta", symbol: "META", quantity: 40, price: 350.1, purchaseDate: "2024-02-20" },
      { id: 7, name: "NVIDIA", symbol: "NVDA", quantity: 10, price: 490.2, purchaseDate: "2023-10-01" },
      { id: 8, name: "Netflix", symbol: "NFLX", quantity: 35, price: 400.5, purchaseDate: "2023-09-15" },
      { id: 9, name: "Adobe", symbol: "ADBE", quantity: 18, price: 570.3, purchaseDate: "2023-11-10" },
      { id: 10, name: "Intel", symbol: "INTC", quantity: 60, price: 34.2, purchaseDate: "2024-01-05" },
    ];

    dispatch(setHoldings(fetchedHoldings));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      filterHoldings({
        nameFilter: holdingNameFilter,
        quantityRange: quantityRangeFilter,
      })
    );
  }, [holdingNameFilter, quantityRangeFilter, dispatch]);

  const handleTrade = (stock, actionType) => {
    if (actionType === "buy") {
      localStorage.setItem("buy", JSON.stringify(stock));
      navigate(`/trade/buy/${stock.name}`);
    } else if (actionType === "sell") {
      localStorage.setItem("sell", JSON.stringify(stock));
      navigate(`/trade/sell/${stock.name}`);
    }
  };

  const calculateAge = (purchaseDate) => {
    const currentDate = new Date();
    const purchase = new Date(purchaseDate);
    const ageInDays = Math.ceil((currentDate - purchase) / (1000 * 60 * 60 * 24));
    return `${ageInDays} days`;
  };

  const columns = ["Symbol", "Holding Name", "Quantity", "Current Price", "Age"];
  const columnKeys = ["symbol", "name", "quantity", "price", "age"];

  // Sort the holdings based on the selected column
  const sortedHoldings = [...holdings].map((holding) => ({
    ...holding,
    age: calculateAge(holding.purchaseDate),
  }));

  if (sortColumn) {
    sortedHoldings.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Calculate the stocks to be shown for the current page
  const indexOfLastHolding = currentPage * itemsPerPage;
  const indexOfFirstHolding = indexOfLastHolding - itemsPerPage;
  const currentHoldings = sortedHoldings.slice(indexOfFirstHolding, indexOfLastHolding);

  const totalPages = Math.ceil(sortedHoldings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Holdings</h2>

        <Row>
          <Col sm={6}>
            <Form.Control
              type="text"
              placeholder="Filter by holding name"
              value={holdingNameFilter}
              onChange={(e) => setHoldingNameFilter(e.target.value)}
              className="mb-5"
            />
          </Col>
        </Row>

        <TableComponent
          columns={columns}
          columnKeys={columnKeys}
          data={currentHoldings}
          buyButtonType="buy"
          sellButtonType="sell"
          onButtonClick={handleTrade}
          onHeaderClick={handleSort}
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
      </div>
    </>
  );
};

export default HoldingsDashboard;
