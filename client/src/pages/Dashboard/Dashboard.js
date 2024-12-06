import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import Header from "../../components/Header/Header";
import TableComponent from "../../components/Table/Table";

const stocks = [
  { id: 1, name: "Apple", quantity: 50, price: 175.5 },
  { id: 2, name: "Tesla", quantity: 30, price: 272.3 },
  { id: 3, name: "Microsoft", quantity: 20, price: 315.0 },
  { id: 4, name: "Amazon", quantity: 15, price: 144.7 },
  { id: 5, name: "Google", quantity: 25, price: 137.6 },
  { id: 6, name: "Meta", quantity: 40, price: 350.1 },
  { id: 7, name: "NVIDIA", quantity: 10, price: 490.2 },
  { id: 8, name: "Netflix", quantity: 35, price: 400.5 },
  { id: 9, name: "Adobe", quantity: 18, price: 570.3 },
  { id: 10, name: "Intel", quantity: 60, price: 34.2 },
];

const Dashboard = () => {
  const [filteredStocks, setFilteredStocks] = useState(stocks);
  const [stockNameFilter, setStockNameFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: 0, max: Infinity });
  const [remainingMoney] = useState(5000); // Example: Money user has left after investment
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = stocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(stockNameFilter.toLowerCase()) &&
        stock.price >= priceRangeFilter.min &&
        stock.price <= priceRangeFilter.max
    );
    setFilteredStocks(filtered);
  }, [stockNameFilter, priceRangeFilter]);

  const handleTrade = (action, stock) => {
    if (!stock) {
      console.error("Stock not provided for trading.");
      return;
    }
    navigate(`/trade/${action}/${stock.name}`);
  };

  const columns = ["Stock Name", "Current Price"];
  const columnKeys = ["name", "price"];

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Stock Market Dashboard</h2>

        {/* Filters */}
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

        {/* Summary Fields */}
        <div className="row mb-4 text-center">
          <div className="col-md-4">
            <strong>Remaining Money:</strong>
            <p className="text-warning">${remainingMoney.toFixed(2)}</p>
          </div>
        </div>

        {/* Stock Table */}
        <TableComponent
          columns={columns}
          columnKeys={columnKeys}
          data={filteredStocks} // Pass filteredStocks here
          buttonType="buy"
          onButtonClick={handleTrade} // Make sure this receives the stock object
        />
      </div>
    </>
  );
};

export default Dashboard;
