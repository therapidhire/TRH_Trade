
// Holding.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import Header from "../../components/Header/Header";
import TableComponent from "../../components/Table/Table"; // Import the reusable Table

const userHoldings = [
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

const Holding = () => {
  const [holdings, setHoldings] = useState(userHoldings);
  const [filteredHoldings, setFilteredHoldings] = useState(userHoldings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stockNameFilter, setStockNameFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: 0, max: Infinity });

  const totalInvested = 20000; // Example: Total amount user invested in stocks
  const remainingMoney = 5000; // Example: Money user has left after investment

  const navigate = useNavigate();

  // Simulate API call to fetch holdings
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulated delay
  }, []);

  // Filter holdings based on the filters
  useEffect(() => {
    const filtered = holdings.filter(
      (stock) =>
        stock.name.toLowerCase().includes(stockNameFilter.toLowerCase()) &&
        stock.price >= priceRangeFilter.min &&
        stock.price <= priceRangeFilter.max
    );
    setFilteredHoldings(filtered);
  }, [stockNameFilter, priceRangeFilter, holdings]);
  const calculateTotalValue = () => {
    return holdings
      .reduce((total, stock) => total + stock.quantity * stock.price, 0)
      .toFixed(2);
  };
  // Navigate to the Sell Page
  const handleSell = (stock) => {
    navigate(`/trade/sell/${stock.name}`);
  };

  // Columns for the table
  const columns = ["Stock Name", "Quantity", "Current Price"];
  const columnKeys = ["name", "quantity", "price"]

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Stock Holdings</h2>

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
            <strong>Total Invested:</strong>
            <p className="text-primary">${totalInvested.toFixed(2)}</p>
          </div>
          <div className="col-md-4">
            <strong>Remaining Money:</strong>
            <p className="text-warning">${remainingMoney.toFixed(2)}</p>
          </div>
          <div className="col-md-4">
            <strong>Current Portfolio Value:</strong>
            <p className="text-success">${calculateTotalValue()}</p>
          </div>
        </div>

        {/* Loader or Table */}
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <TableComponent
            columns={columns}
            columnKeys={columnKeys}
            data={filteredHoldings}
            buttonType="sell"
            onButtonClick={handleSell}
          />
        )}
      </div>
    </>
  );
};

export default Holding;
