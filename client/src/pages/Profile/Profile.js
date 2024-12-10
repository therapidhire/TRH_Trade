import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";

import Header from "../../components/Header/Header";

const Profile = () => {
  const userRole = localStorage.getItem("role"); // Get user role
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage
  const [view, setView] = useState("userDetails"); // Default view for user details
  const [users, setUsers] = useState([]); // Users state
  const [stocks, setStocks] = useState([]); // Stocks state
  const [userDetails, setUserDetails] = useState(null); // State for single user details
  const [showAddStockModal, setShowAddStockModal] = useState(false); // State for showing modal
  const [newStock, setNewStock] = useState({
    stockName: "",
    symbol: "",
    isin_Num: "",
    price: "",
  });

  // Fetch all users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/userCrud/getAlluser"
      );
      console.log("response.data", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch all stocks from the API
  const fetchStocks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/stock/getStock"
      );

      console.log(response.data.data);
      const res = response.data.data;
      // Filter and set only the required stock details
      const combinedStocks = res.map((stockEntry) => ({
        symbol: stockEntry.stockListData.symbol || "N/A", // Get stock symbol
        name: stockEntry.stockListData.stockName || "N/A", // Get stock name
        price: stockEntry.price || "N/A", // Assuming price is in stocklistdata
        isinNumber: stockEntry.stockListData.isin_Num,
      }));

      console.log("filteredData", combinedStocks);

      setStocks(combinedStocks); // Update state with filtered data
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  // Fetch single user details by ID
  const fetchUserById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/userCrud/getUserById/${userId}`
      );
      console.log("User Details:", response.data);
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/userCrud/deleteUser/${userId}`
      );
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Delete a stock
  const deleteStock = async (stockId) => {
    try {
      console.log("Stock Id in delete", stockId);
      await axios.delete(
        `http://localhost:8080/api/stock/deleteStock/${stockId}`
      );
      console.log("Stock Id in delete--------", stockId);
      setStocks(stocks.filter((stock) => stock.id !== stockId));
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  // Handle input change for the stock form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock((prevStock) => ({
      ...prevStock,
      [name]: value,
    }));
  };

  // Handle adding a new stock
  const handleAddStock = async () => {
    try {
      console.log("call handle add stock")
      const response = await axios.post(
        "http://localhost:8080/api/stock/addStock",
        {
          stockName: newStock.stockName,
          symbol: newStock.symbol,
          isin_Num: newStock.isin_Num,
        }
      );
      setStocks([...stocks, response.data]); // Add the new stock to the state
      setShowAddStockModal(false); // Close modal
      setNewStock({ name: "", symbol: "", isin_Num: "" }); // Reset form
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (userRole === "Admin") {
      fetchUsers();
      fetchStocks();
    } else if (userRole === "User") {
      fetchUserById();
    }
  }, [userRole]);

  return (
    <>
      <Header />
      <Container fluid className="mt-4">
        {userRole === "Admin" ? (
          <Row>
            {/* Left Sidebar */}
            <Col md={2} className="bg-light p-3">
              <Button
                className="w-100 mb-3"
                variant="primary"
                onClick={() => setView("userDetails")}
              >
                Show All Users
              </Button>
              <Button
                className="w-100 mb-3"
                variant="primary"
                onClick={() => setView("stocks")}
              >
                Show All Stocks
              </Button>
              <Button
                className="w-100 mb-3"
                variant="primary"
                onClick={() => setShowAddStockModal(true)} // Show the Add Stock modal
              >
                Add Stock
              </Button>
            </Col>

            {/* Right Content Area */}
            <Col md={10} className="p-3">
              {view === "userDetails" && (
                <Card>
                  <Card.Header>
                    <h5>All Users</h5>
                  </Card.Header>
                  <Card.Body>
                    {users.length > 0 ? (
                      <Table bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td>{`${user.firstName} ${user.lastName}`}</td>{" "}
                              {/* Combine firstName and lastName */}
                              <td>{user.email}</td>
                              <td>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => deleteUser(user.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <Alert variant="info">No users found!</Alert>
                    )}
                  </Card.Body>
                </Card>
              )}

              {view === "stocks" && (
                <Card>
                  <Card.Header>
                    <h5>All Stocks</h5>
                  </Card.Header>
                  <Card.Body>
                    {stocks.length > 0 ? (
                      <Table bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Stock Symbol</th>
                            <th>Stock Name</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stocks.map((stock) => (
                            <tr key={stock.id}>
                              <td>{stock.symbol}</td>
                              <td>{stock.name}</td>
                              <td>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => deleteStock(stock.isinNumber)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <Alert variant="info">No stocks found!</Alert>
                    )}
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        ) : userRole === "User" ? (
          <Card>
            <Card.Header>
              <h5>User Details</h5>
            </Card.Header>
            <Card.Body>
              {userDetails ? (
                <Table bordered hover responsive>
                  <tbody>
                    <tr>
                      <th>Full Name</th>
                      <td>{`${userDetails.firstName} ${userDetails.lastName}`}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{userDetails.email}</td>
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Loading user details...</Alert>
              )}
            </Card.Body>
          </Card>
        ) : (
          <Alert variant="danger">Unauthorized access</Alert>
        )}
      </Container>

      {/* Modal for adding stock */}
      <Modal
        show={showAddStockModal}
        onHide={() => setShowAddStockModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="stockName">
              <Form.Label>Stock Name</Form.Label>
              <Form.Control
                type="text"
                name="stockName"
                value={newStock.stockName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="symbol">
              <Form.Label>Stock Symbol</Form.Label>
              <Form.Control
                type="text"
                name="symbol"
                value={newStock.symbol}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="isin_Num">
              <Form.Label>ISIN Number</Form.Label>
              <Form.Control
                type="text"
                name="isin_Num"
                value={newStock.isin_Num}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newStock.price}
                onChange={handleInputChange}
              />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddStockModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddStock}>
            Add Stock
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
