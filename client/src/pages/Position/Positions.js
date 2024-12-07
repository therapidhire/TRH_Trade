import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spinner, Alert, Pagination, Table } from "react-bootstrap";
import { fetchStocks, sortStocks } from "../../redux/slices/positionSlice";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

const Position = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stocks, loading, error, sortConfig } = useSelector(
    (state) => state.position
  );

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

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
    const diffInDays = Math.floor(
      (currentDate - purchase) / (1000 * 60 * 60 * 24)
    );
    return `${diffInDays} days`;
  };

  const handleSort = (key) => {
    dispatch(sortStocks({ key }));
  };

  const indexOfLastStock = currentPage * itemsPerPage;
  const indexOfFirstStock = indexOfLastStock - itemsPerPage;
  const currentStocks = stocks.slice(indexOfFirstStock, indexOfLastStock);

  const totalPages = Math.ceil(stocks.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Stocks</h2>

        {/* {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : stocks.length > 0 ? ( */}
        <>
          {/* <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort("symbol")} style={{ cursor: "pointer" }}>
                    Symbol
                  </th>
                  <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                    Stock Name
                  </th>
                  <th onClick={() => handleSort("quantity")} style={{ cursor: "pointer" }}>
                    Quantity
                  </th>
                  <th onClick={() => handleSort("price")} style={{ cursor: "pointer" }}>
                    Current Price
                  </th>
                  <th onClick={() => handleSort("purchaseDate")} style={{ cursor: "pointer" }}>
                    Age
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStocks.map((stock) => (
                  <tr key={stock.id}>
                    <td>{stock.symbol}</td>
                    <td>{stock.name}</td>
                    <td>{stock.quantity}</td>
                    <td>{stock.price.toFixed(2)}</td>
                    <td>{calculateAge(stock.purchaseDate)}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleTrade(stock, "buy")}>
                        Buy
                      </Button>{" "}
                      <Button
                        style={{
                          backgroundColor: "#f57300",
                          fontWeight: "bold",
                          color: "white",
                          border: "none",
                        }}
                        onClick={() => handleTrade(stock, "sell")}
                      >
                        Sell
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table> */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("symbol")}
                  style={{ cursor: "pointer" }}
                >
                  Symbol
                </th>
                <th
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  Stock Name
                </th>
                <th
                  onClick={() => handleSort("quantity")}
                  style={{ cursor: "pointer" }}
                >
                  Quantity
                </th>
                <th
                  onClick={() => handleSort("price")}
                  style={{ cursor: "pointer" }}
                >
                  Current Price
                </th>
                <th
                  onClick={() => handleSort("purchaseDate")}
                  style={{ cursor: "pointer" }}
                >
                  Age
                </th>
                <th>Total Price</th> {/* Add Total Price column */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStocks.map((stock) => (
                <tr key={stock.id}>
                  <td>{stock.symbol}</td>
                  <td>{stock.name}</td>
                  <td>{stock.quantity}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{calculateAge(stock.purchaseDate)}</td>
                  <td>{(stock.quantity * stock.price).toFixed(2)}</td>{" "}
                  {/* Calculate Total Price */}
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleTrade(stock, "buy")}
                    >
                      Buy
                    </Button>{" "}
                    <Button
                      style={{
                        backgroundColor: "#f57300",
                        fontWeight: "bold",
                        color: "white",
                        border: "none",
                      }}
                      onClick={() => handleTrade(stock, "sell")}
                    >
                      Sell
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

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
        </>
        {/* // ) : (
        //   <Alert variant="info">No stocks found for this user.</Alert>
        // )} */}
      </div>
    </>
  );
};

export default Position;
