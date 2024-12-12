import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Pagination } from "react-bootstrap";
import Header from "../../components/Header/Header";
import axios from "axios";

const Positions = () => {
  const navigate = useNavigate();

  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [holdingNameFilter, setHoldingNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 5;

  const userId = localStorage.getItem("userId");

  // useEffect(() => {
  //   const fetchPositions = async () => {
  //     try {
  //       console.log("Fetching positions for user id:", userId);

  //       // Fetch stock transactions for the user
  //       const response = await axios.get(
  //         `http://localhost:8080/api/stock-transactions/transaction/${userId}`
  //       );

  //       const positionsData = response.data;
  //       console.log("positionsData", positionsData)

  //       // Filter positions created by the user
  //       const filtered = positionsData.filter(
  //         (position) => position.CreatedBy === userId
  //       );

  //       // Map over positions to format for table columns
  //       const formattedPositions = await Promise.all(
  //         filtered.map(async (position) => {
  //           const stockResponse = await axios.get(
  //             `http://localhost:8080/api/stocks/${position.StockId}`
  //           );

  //           const stockData = stockResponse.data;
  //           console.log("stockData", stockData)

  //           const newStockData = stockData.filter((pos)=>{
  //             calculateAge(position.CreatedAt) <= 1;
  //           })
            
            

  //           return {
  //             symbol: newStockData.Symbol,
  //             name: newStockData.StockName,
  //             quantity: position.Quantity,
  //             price: position.Price,
  //             totalPrice: (position.Quantity * position.Price).toFixed(2),
  //             age: calculateAge(position.CreatedAt),
  //           };
  //         })
  //       );

  //       setPositions(formattedPositions);
  //       setFilteredPositions(formattedPositions);

  //       console.log("Formatted Positions:", formattedPositions);
  //     } catch (error) {
  //       console.error("Error fetching positions:", error);
  //     }
  //   };

  //   fetchPositions();
  // }, [userId]);

  
  
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        console.log("Fetching positions for user id:", userId);
  
        // Fetch stock transactions for the user
        const response = await axios.get(
          `http://localhost:8080/api/stock-transactions/transaction/${userId}`
        );
  
        const positionsData = response.data;
        console.log("positionsData", positionsData);
  
        // Filter positions created by the user
        const filtered = positionsData.filter(
          (position) => position.CreatedBy === userId
        );
  
        // Map over positions to format for table columns
        const formattedPositions = await Promise.all(
          filtered.map(async (position) => {
            const stockResponse = await axios.get(
              `http://localhost:8080/api/stocks/${position.StockId}`
            );
  
            const stockData = stockResponse.data;
  
            // Calculate the age and filter for age <= 1 day
            const age = calculateAge(position.CreatedAt);
            if (age <= 1) {
              return {
                symbol: stockData.Symbol,
                name: stockData.StockName,
                quantity: position.Quantity,
                price: position.Price,
                totalPrice: (position.Quantity * position.Price).toFixed(2),
                age: `${age} days`,
              };
            }
            return null; // Return null for positions that don't match the criteria
          })
        );
  
        // Remove null entries from the final positions
        const validPositions = formattedPositions.filter((pos) => pos !== null);
  
        setPositions(validPositions);
        setFilteredPositions(validPositions);
  
        console.log("Filtered and Formatted Positions:", validPositions);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };
  
    fetchPositions();
  }, [userId]);
  
  const calculateAge = (purchaseDate) => {
    const currentDate = new Date();
    const purchase = new Date(purchaseDate);
    const ageInDays = Math.ceil(
      (currentDate - purchase) / (1000 * 60 * 60 * 24)
    );
    return ageInDays; // Return the age as a number
  };
  
  
  // const calculateAge = (purchaseDate) => {
  //   const currentDate = new Date();
  //   const purchase = new Date(purchaseDate);
  //   const ageInDays = Math.ceil(
  //     (currentDate - purchase) / (1000 * 60 * 60 * 24)
  //   );
  //   return `${ageInDays} days`;
  // };

  const handleTrade = (stock, actionType) => {
    if (actionType === "buy") {
      localStorage.setItem("buy", JSON.stringify(stock));
      navigate(`/trade/buy/${stock.name}`);
    } else if (actionType === "sell") {
      localStorage.setItem("sell", JSON.stringify(stock));
      navigate(`/trade/sell/${stock.name}`);
    }
  };

  const handleFilter = (filterValue) => {
    setHoldingNameFilter(filterValue);

    const filtered = positions.filter((position) =>
      position.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredPositions(filtered);
  };

  const handleSort = (columnKey) => {
    const sorted = [...filteredPositions];
    if (sortColumn === columnKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortOrder("asc");
    }

    sorted.sort((a, b) => {
      const aValue = a[columnKey];
      const bValue = b[columnKey];
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPositions(sorted);
  };

  const indexOfLastPosition = currentPage * itemsPerPage;
  const indexOfFirstPosition = indexOfLastPosition - itemsPerPage;
  const currentPositions = filteredPositions.slice(
    indexOfFirstPosition,
    indexOfLastPosition
  );

  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Positions</h2>

        <Row>
          <Col sm={6}>
            <Form.Control
              type="text"
              placeholder="Filter by Position name"
              value={holdingNameFilter}
              onChange={(e) => handleFilter(e.target.value)}
              className="mb-5"
            />
          </Col>
        </Row>

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
                <td>{position.totalPrice}</td>
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
