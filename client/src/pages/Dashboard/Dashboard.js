import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Pagination } from "react-bootstrap";
import Header from "../../components/Header/Header";
import TableComponent from "../../components/Table/Table";
import { setStocks, filterStocks } from "../../redux/slices/stocksSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stocks = useSelector((state) => state.stocks.filteredStocks || []);
  const [stockNameFilter, setStockNameFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: 0, max: Infinity });
  const [remainingMoney] = useState(5000); // Example: Remaining money after investments

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to show per page

  useEffect(() => {
    const fetchedStocks = [
      { id: 1, name: "Apple", symbol: "AAPL", quantity: 50, price: 175.5 },
      { id: 2, name: "Tesla", symbol: "TSLA", quantity: 30, price: 272.3 },
      { id: 3, name: "Microsoft", symbol: "MSFT", quantity: 20, price: 315.0 },
      { id: 4, name: "Amazon", symbol: "AMZN", quantity: 15, price: 144.7 },
      { id: 5, name: "Google", symbol: "GOOGL", quantity: 25, price: 137.6 },
      { id: 6, name: "Meta", symbol: "META", quantity: 40, price: 350.1 },
      { id: 7, name: "NVIDIA", symbol: "NVDA", quantity: 10, price: 490.2 },
      { id: 8, name: "Netflix", symbol: "NFLX", quantity: 35, price: 400.5 },
      { id: 9, name: "Adobe", symbol: "ADBE", quantity: 18, price: 570.3 },
      { id: 10, name: "Intel", symbol: "INTC", quantity: 60, price: 34.2 },
    ];
    dispatch(setStocks(fetchedStocks));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      filterStocks({
        nameFilter: stockNameFilter,
        priceRange: priceRangeFilter,
      })
    );
  }, [stockNameFilter, priceRangeFilter, dispatch]);

  const handleTrade = (stock, actionType) => {
    // Action type can be "buy" or "sell"
    if (actionType === "buy") {
      localStorage.setItem("buy", JSON.stringify(stock));
      navigate(`/trade/buy/${stock.name}`);
    } else if (actionType === "sell") {
      localStorage.setItem("sell", JSON.stringify(stock));
      navigate(`/trade/sell/${stock.name}`);
    }
  };

  const columns = ["Symbol", "Stock Name", "Current Price"];
  const columnKeys = ["symbol", "name", "price"];

  // Calculate which stocks to display based on the current page
  const indexOfLastStock = currentPage * itemsPerPage;
  const indexOfFirstStock = indexOfLastStock - itemsPerPage;
  const currentStocks = stocks.slice(indexOfFirstStock, indexOfLastStock);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination buttons
  const totalPages = Math.ceil(stocks.length / itemsPerPage);
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
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
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Stock Market Dashboard</h2>

        <Form className="mb-4">
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
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Stock Price Range</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="number"
                    placeholder="Min Price"
                    onChange={(e) =>
                      setPriceRangeFilter((prev) => ({
                        ...prev,
                        min: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                  <Form.Control
                    type="number"
                    placeholder="Max Price"
                    className="ms-2"
                    onChange={(e) =>
                      setPriceRangeFilter((prev) => ({
                        ...prev,
                        max: parseFloat(e.target.value) || Infinity,
                      }))
                    }
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <div className="row mb-4 text-center">
          <div className="col-md-4">
            <strong>Remaining Money:</strong>
            <p className="text-warning">${remainingMoney.toFixed(2)}</p>
          </div>
        </div>

        <TableComponent
          columns={columns}
          columnKeys={columnKeys}
          data={currentStocks} // Display current page stocks
          buyButtonType="buy"
          sellButtonType="sell"
          onButtonClick={handleTrade}
        />

        <div className="d-flex justify-content-center mt-4">
          <Pagination>{paginationItems}</Pagination>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
