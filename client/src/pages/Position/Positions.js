// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Form, Row, Col, Pagination } from "react-bootstrap";
// import Header from "../../components/Header/Header";
// import { setHoldings, filterHoldings } from "../../redux/slices/holdingsSlice";
// import axios from "axios";

// const Positions = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const holdings = useSelector(
//     (state) => state.holdings.filteredHoldings || []
//   );
//   const [holdingNameFilter, setHoldingNameFilter] = useState("");
//   const [totalAmount, setTotalAmount] = useState("");
//   const [quantityRangeFilter, setQuantityRangeFilter] = useState({
//     min: 0,
//     max: Infinity,
//   });
//   const [remainingMoney] = useState(5000);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState(null);
//   const [sortOrder, setSortOrder] = useState("asc");
//   const itemsPerPage = 5;

//   const userId = localStorage.getItem("userId");

//   useEffect(() => {
//     const fetchPositions = async () => {
//       try {
//         console.log("user id", userId);

//         const response = await axios.get(
//           `http://localhost:8080/api/stock-transactions/transaction/${userId}`
//         );

//         // console.log("position response---", response.data);

//         const positions = response.data;
//         // console.log("type of position:-", typeof positions)

//         if (positions) {
//           const filteredPositions = positions.filter((position) => {
           
//             const ageInDays = calculateAge(position.createdAt);
//             const extractedNumber = parseInt(ageInDays[0], 10);
//             return extractedNumber <= 1;
//           });

//           // console.log("// Map and fetch additional details for each position")
//           console.log("position response---", response.data);

//           const detailedPositions = await Promise.all(
//             filteredPositions.map(async (position) => {
//               try {
//                 console.log(position);
//                 // console.log("// API call to fetch stock details");
//                 const stockResponse = await axios.get(
//                   `http://localhost:8080/api/stocks/${position.stockId}`
//                 );

//                 const stockDetails = stockResponse.data;

//                 return {
//                   symbol: stockDetails.symbol || "N/A",
//                   name: stockDetails.name || "N/A",
//                   quantity: position.stockQty || 0,
//                   price: stockDetails.price || 0,
//                   totalPrice:
//                     (position.stockQty || 0) * (stockDetails.price || 0),
//                   isinNumber: stockDetails.isin_Num,
//                   age: calculateAge(position.createdAt),
//                 };
//               } catch (error) {
//                 console.error(
//                   `Error fetching details for stock ${position.stockId}:`,
//                   error
//                 );
//                 return {
//                   symbol: "N/A",
//                   name: "N/A",
//                   quantity: position.stockQty || 0,
//                   price: 0,
//                   totalPrice: 0,
//                   isinNumber: "N/A",
//                   age: calculateAge(position.createdAt),
//                 };
//               }
//             })
//           );

//           // console.log("Detailed positions:", detailedPositions);
//           dispatch(setHoldings(detailedPositions));
//         }
//       } catch (error) {
//         console.error("Error fetching positions:", error);
//       }
//     };

//     fetchPositions();
//   }, [dispatch, userId]);

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

//   const calculateAge = (purchaseDate) => {
//     const currentDate = new Date();
//     const purchase = new Date(purchaseDate);
//     const ageInDays = Math.ceil(
//       (currentDate - purchase) / (1000 * 60 * 60 * 24)
//     );
//     return `${ageInDays} days`;
//   };

//   const columns = [
//     "Symbol",
//     "Position Name",
//     "Quantity",
//     "Buy Price",
//     "Total Amount",
//     "Buying Age",
//   ];
//   const columnKeys = [
//     "symbol",
//     "name",
//     "quantity",
//     "price",
//     "totalPrice",
//     "age",
//   ];

//   const sortedHoldings = [...holdings];

//   if (sortColumn) {
//     sortedHoldings.sort((a, b) => {
//       const aValue = a[sortColumn];
//       const bValue = b[sortColumn];
//       if (sortOrder === "asc") {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });
//   }

//   const indexOfLastHolding = currentPage * itemsPerPage;
//   const indexOfFirstHolding = indexOfLastHolding - itemsPerPage;
//   const currentPositions = sortedHoldings.slice(
//     indexOfFirstHolding,
//     indexOfLastHolding
//   );

//   const totalPages = Math.ceil(sortedHoldings.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleSort = (columnKey) => {
//     if (sortColumn === columnKey) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortColumn(columnKey);
//       setSortOrder("asc");
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container mt-5">
//         <h2 className="text-center mb-4">Your Position</h2>

//         <Row>
//           <Col sm={6}>
//             <Form.Control
//               type="text"
//               placeholder="Filter by Position name"
//               value={holdingNameFilter}
//               onChange={(e) => setHoldingNameFilter(e.target.value)}
//               className="mb-5"
//             />
//           </Col>
//         </Row>

//         {/* Simple HTML Table */}
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               {columns.map((column, index) => (
//                 <th
//                   key={index}
//                   onClick={() => handleSort(columnKeys[index])}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {column}{" "}
//                   {sortColumn === columnKeys[index] &&
//                     (sortOrder === "asc" ? "↑" : "↓")}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {currentPositions.map((position, index) => (
//               <tr key={index}>
//                 <td>{position.symbol}</td>
//                 <td>{position.name}</td>
//                 <td>{position.quantity}</td>
//                 <td>{position.price}</td>
//                 <td>{position.totalPrice}</td>{" "}
//                 {/* Format to 2 decimal places */}
//                 <td>{position.age}</td>
//                 <td>
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => handleTrade(position, "buy")}
//                   >
//                     Buy
//                   </button>
//                   <button
//                     className="btn m-2"
//                     style={{
//                       backgroundColor: "#f57300",
//                       fontWeight: "bold",
//                       color: "white",
//                     }}
//                     onClick={() => handleTrade(position, "sell")}
//                   >
//                     Sell
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

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

// export default Positions;



import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Pagination } from "react-bootstrap";
import Header from "../../components/Header/Header";
import { setHoldings, filterHoldings } from "../../redux/slices/holdingsSlice";
import axios from "axios";

const Positions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const holdings = useSelector(
    (state) => state.holdings.filteredHoldings || []
  );
  const [holdingNameFilter, setHoldingNameFilter] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [quantityRangeFilter, setQuantityRangeFilter] = useState({
    min: 0,
    max: Infinity,
  });
  const [remainingMoney] = useState(5000);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 5;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        console.log("user id", userId);

        const response = await axios.get(
          `http://localhost:8080/api/stock-transactions/transaction/${userId}`
        );

        // console.log("position response---", response.data);

        const positions = response.data;
        console.log("position response---", positions);

        const filteredPositions = positions.filter((position)=>{
          return position.CreatedBy == userId;
        })

        console.log("filteredPositions:- ", filteredPositions)

      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, [dispatch, userId]);

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
    const ageInDays = Math.ceil(
      (currentDate - purchase) / (1000 * 60 * 60 * 24)
    );
    return `${ageInDays} days`;
  };

  const columns = [
    "Symbol",
    "Position Name",
    "Quantity",
    "Buy Price",
    "Total Amount",
    "Buying Age",
  ];
  const columnKeys = [
    "symbol",
    "name",
    "quantity",
    "price",
    "totalPrice",
    "age",
  ];

  const sortedHoldings = [...holdings];

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

  const indexOfLastHolding = currentPage * itemsPerPage;
  const indexOfFirstHolding = indexOfLastHolding - itemsPerPage;
  const currentPositions = sortedHoldings.slice(
    indexOfFirstHolding,
    indexOfLastHolding
  );

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
        <h2 className="text-center mb-4">Your Position</h2>

        <Row>
          <Col sm={6}>
            <Form.Control
              type="text"
              placeholder="Filter by Position name"
              value={holdingNameFilter}
              onChange={(e) => setHoldingNameFilter(e.target.value)}
              className="mb-5"
            />
          </Col>
        </Row>

        {/* Simple HTML Table */}
        <table className="table table-bordered">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(columnKeys[index])}
                  style={{ cursor: "pointer" }}
                >
                  {column}{" "}
                  {sortColumn === columnKeys[index] &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentPositions.map((position, index) => (
              <tr key={index}>
                <td>{position.symbol}</td>
                <td>{position.name}</td>
                <td>{position.quantity}</td>
                <td>{position.price}</td>
                <td>{position.totalPrice}</td>{" "}
                {/* Format to 2 decimal places */}
                <td>{position.age}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleTrade(position, "buy")}
                  >
                    Buy
                  </button>
                  <button
                    className="btn m-2"
                    style={{
                      backgroundColor: "#f57300",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    onClick={() => handleTrade(position, "sell")}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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

export default Positions;
