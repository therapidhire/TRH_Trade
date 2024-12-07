// import React, { useState } from "react";
// import {
//   Container,
//   Table,
//   Button,
//   Row,
//   Col,
//   Card,
//   Alert,
// } from "react-bootstrap";
// import Header from "../../components/Header/Header";

// // Dummy data for users with transaction history
// const dummyUsers = [
//   {
//     id: 1,
//     name: "Alice Smith",
//     email: "alice@example.com",
//     transactions: [
//       { type: "buy", date: "2024-01-05" },
//       { type: "sell", date: "2024-02-01" },
//       { type: "buy", date: "2024-03-10" },
//     ],
//   },
//   {
//     id: 2,
//     name: "Bob Johnson",
//     email: "bob@example.com",
//     transactions: [
//       { type: "buy", date: "2024-02-15" },
//       { type: "buy", date: "2024-03-18" },
//       { type: "sell", date: "2024-04-01" },
//     ],
//   },
//   {
//     id: 3,
//     name: "Charlie Brown",
//     email: "charlie@example.com",
//     transactions: [
//       { type: "buy", date: "2024-06-25" },
//       { type: "sell", date: "2024-07-20" },
//     ],
//   },
// ];

// // Dummy data for stocks
// const dummyStocks = [
//   { id: 1, stockSymbol: "AAPL", stockName: "Apple"},
//   { id: 2, stockSymbol: "GOOG", stockName: "Google" },
//   { id: 3, stockSymbol: "TSLA", stockName: "Tesla" },
// ];

// // Function to calculate weekly and monthly transactions
// const getTransactionCount = (transactions, period) => {
//   const currentDate = new Date();
//   const periodStart = new Date(currentDate);

//   if (period === "weekly") {
//     periodStart.setDate(currentDate.getDate() - 7); // 7 days ago
//   } else if (period === "monthly") {
//     periodStart.setMonth(currentDate.getMonth() - 1); // 1 month ago
//   }

//   return transactions.filter((transaction) => {
//     const transactionDate = new Date(transaction.date);
//     return transactionDate >= periodStart;
//   }).length;
// };

// const Profile = () => {
//   const userRole = localStorage.getItem("role"); // Get user role
//   const [view, setView] = useState("userDetails"); // Default view for user details
//   const [users, setUsers] = useState(dummyUsers); // Dummy users
//   const [stocks, setStocks] = useState(dummyStocks); // Dummy stocks

//   // Delete user
//   const deleteUser = (userId) => {
//     setUsers(users.filter((user) => user.id !== userId));
//   };

//   // Delete stock
//   const deleteStock = (stockId) => {
//     setStocks(stocks.filter((stock) => stock.id !== stockId));
//   };

//   return (
//     <>
//       <Header />
//       <Container fluid className="mt-4">
//         {userRole === "Admin" ? (
//           <Row>
//             {/* Left Sidebar */}
//             <Col md={2} className="bg-light p-3">
//               <Button
//                 className="w-100 mb-3"
//                 variant="primary"
//                 onClick={() => setView("userDetails")}
//               >
//                 Show All Users
//               </Button>
//               <Button
//                 className="w-100 mb-3"
//                 variant="primary"
//                 onClick={() => setView("stocks")}
//               >
//                 Show All Stocks
//               </Button>
//               <Button className="w-100 mb-3" variant="primary">
//                 More Options
//               </Button>
//             </Col>

//             {/* Right Content Area */}
//             <Col md={10} className="p-3">
//               {/* {view === "userDetails" && (
//                 <Card>
//                   <Card.Header>
//                     <h5>All Users</h5>
//                   </Card.Header>
//                   <Card.Body>
//                     {users.length > 0 ? (
//                       <Table bordered hover responsive>
//                         <thead>
//                           <tr>
//                             <th>Name</th>
//                             <th>Email</th>
//                             <th>Weekly Buy Transactions</th>
//                             <th>Weekly Sell Transactions</th>
//                             <th>Monthly Buy Transactions</th>
//                             <th>Monthly Sell Transactions</th>
//                             <th>Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {users.map((user) => (
//                             <tr key={user.id}>
//                               <td>{user.name}</td>
//                               <td>{user.email}</td>
//                               <td>{getTransactionCount(user.transactions, "weekly")}</td>
//                               <td>{getTransactionCount(user.transactions, "weekly")}</td>
//                               <td>{getTransactionCount(user.transactions, "monthly")}</td>
//                               <td>{getTransactionCount(user.transactions, "monthly")}</td>
//                               <td>
//                                 <Button variant="warning" size="sm" className="me-2 m-2">
//                                   Edit
//                                 </Button>
//                                 <Button
//                                   variant="danger"
//                                   size="sm"
//                                   onClick={() => deleteUser(user.id)}
//                                 >
//                                   Delete
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     ) : (
//                       <Alert variant="info">No users found!</Alert>
//                     )}
//                   </Card.Body>
//                 </Card>
//               )} */}
//               {view === "userDetails" && (
//                 <Card>
//                   <Card.Header>
//                     <h5>All Users</h5>
//                   </Card.Header>
//                   <Card.Body>
//                     {users.length > 0 ? (
//                       <Table bordered hover responsive>
//                         <thead>
//                           <tr>
//                             <th rowSpan="2">Name</th>
//                             <th rowSpan="2">Email</th>
//                             <th colSpan="2">Weekly Transactions</th>
//                             <th colSpan="2">Monthly Transactions</th>
//                             <th rowSpan="2">Actions</th>
//                           </tr>
//                           <tr>
//                             <th>Buy</th>
//                             <th>Sell</th>
//                             <th>Buy</th>
//                             <th>Sell</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {users.map((user) => (
//                             <tr key={user.id}>
//                               <td>{user.name}</td>
//                               <td>{user.email}</td>
//                               <td>
//                                 {getTransactionCount(
//                                   user.transactions.filter(
//                                     (t) => t.type === "buy"
//                                   ),
//                                   "weekly"
//                                 )}
//                               </td>
//                               <td>
//                                 {getTransactionCount(
//                                   user.transactions.filter(
//                                     (t) => t.type === "sell"
//                                   ),
//                                   "weekly"
//                                 )}
//                               </td>
//                               <td>
//                                 {getTransactionCount(
//                                   user.transactions.filter(
//                                     (t) => t.type === "buy"
//                                   ),
//                                   "monthly"
//                                 )}
//                               </td>
//                               <td>
//                                 {getTransactionCount(
//                                   user.transactions.filter(
//                                     (t) => t.type === "sell"
//                                   ),
//                                   "monthly"
//                                 )}
//                               </td>
//                               <td>
//                                 <Button
//                                   variant="warning"
//                                   size="sm"
//                                   className="me-2 m-2"
//                                 >
//                                   Edit
//                                 </Button>
//                                 <Button
//                                   variant="danger"
//                                   size="sm"
//                                   onClick={() => deleteUser(user.id)}
//                                 >
//                                   Delete
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     ) : (
//                       <Alert variant="info">No users found!</Alert>
//                     )}
//                   </Card.Body>
//                 </Card>
//               )}

//               {view === "stocks" && (
//                 <Card>
//                   <Card.Header>
//                     <h5>All Stocks</h5>
//                   </Card.Header>
//                   <Card.Body>
//                     {stocks.length > 0 ? (
//                       <Table bordered hover responsive>
//                         <thead>
//                           <tr>
//                             <th>Stock Symbol</th>
//                             <th>Stock Name</th>
//                             <th>Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {stocks.map((stock) => (
//                             <tr key={stock.id}>
//                               <td>{stock.stockSymbol}</td>
//                               <td>{stock.stockName}</td>
//                               <td>
//                                 <Button
//                                   variant="warning"
//                                   size="sm"
//                                   className="me-2"
//                                 >
//                                   Edit
//                                 </Button>
//                                 <Button
//                                   variant="danger"
//                                   size="sm"
//                                   onClick={() => deleteStock(stock.id)}
//                                 >
//                                   Delete
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     ) : (
//                       <Alert variant="info">No stocks found!</Alert>
//                     )}
//                   </Card.Body>
//                 </Card>
//               )}
//             </Col>
//           </Row>
//         ) : (
//           // User view: Personal details only
//           <Card className="shadow-sm mb-4">
//             <Card.Body>
//               <h5 className="text-primary mb-3">Personal Details</h5>
//               <Table bordered>
//                 <tbody>
//                   <tr>
//                     <th>Name</th>
//                     <td>John Doe</td>
//                   </tr>
//                   <tr>
//                     <th>Email</th>
//                     <td>johndoe@example.com</td>
//                   </tr>
//                   <tr>
//                     <th>Date of Birth</th>
//                     <td>1990-05-15</td>
//                   </tr>
//                   <tr>
//                     <th>PAN Number</th>
//                     <td>ABCDE1234F</td>
//                   </tr>
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         )}
//       </Container>
//     </>
//   );
// };

// export default Profile;




import React, { useState } from "react";
import { Container, Table, Button, Row, Col, Card, Alert, Modal, Form } from "react-bootstrap";
import axios from "axios";  // Ensure you have axios installed

import Header from "../../components/Header/Header";

// Dummy data for users with transaction history
const dummyUsers = [
  // Add your dummy users here
];

const dummyStocks = [
  // Add your dummy stocks here
];

// Function to calculate weekly and monthly transactions
const getTransactionCount = (transactions, period) => {
  const currentDate = new Date();
  const periodStart = new Date(currentDate);

  if (period === "weekly") {
    periodStart.setDate(currentDate.getDate() - 7); // 7 days ago
  } else if (period === "monthly") {
    periodStart.setMonth(currentDate.getMonth() - 1); // 1 month ago
  }

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= periodStart;
  }).length;
};

const Profile = () => {
  const userRole = localStorage.getItem("role"); // Get user role
  const [view, setView] = useState("userDetails"); // Default view for user details
  const [users, setUsers] = useState(dummyUsers); // Dummy users
  const [stocks, setStocks] = useState(dummyStocks); // Dummy stocks
  const [showAddStockModal, setShowAddStockModal] = useState(false); // State for showing modal
  const [newStock, setNewStock] = useState({
    stockName: "",
    symbol: "",
    isin_Num: "",
    price: "",
  });

  // Delete user
  const deleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  // Delete stock
  const deleteStock = (stockId) => {
    setStocks(stocks.filter((stock) => stock.id !== stockId));
  };

  // Handle input change for stock form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock((prevStock) => ({
      ...prevStock,
      [name]: value,
    }));
  };

  // Handle add stock
  const handleAddStock = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/addStock", {
        stockName: newStock.stockName,
        symbol: newStock.symbol,
        isin_Num: newStock.isin_Num,
        price: parseFloat(newStock.price),
      });
      setStocks([...stocks, response.data]); // Add the new stock to the state
      setShowAddStockModal(false); // Close modal
    } catch (error) {
      console.error("Error adding stock:", error);
      if (error.response) {
        console.error("Server responded with status:", error.response.status);
        console.error("Response body:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  };
  
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
                            <th rowSpan="2">Name</th>
                            <th rowSpan="2">Email</th>
                            <th colSpan="2">Weekly Transactions</th>
                            <th colSpan="2">Monthly Transactions</th>
                            <th rowSpan="2">Actions</th>
                          </tr>
                          <tr>
                            <th>Buy</th>
                            <th>Sell</th>
                            <th>Buy</th>
                            <th>Sell</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>
                                {getTransactionCount(
                                  user.transactions.filter(
                                    (t) => t.type === "buy"
                                  ),
                                  "weekly"
                                )}
                              </td>
                              <td>
                                {getTransactionCount(
                                  user.transactions.filter(
                                    (t) => t.type === "sell"
                                  ),
                                  "weekly"
                                )}
                              </td>
                              <td>
                                {getTransactionCount(
                                  user.transactions.filter(
                                    (t) => t.type === "buy"
                                  ),
                                  "monthly"
                                )}
                              </td>
                              <td>
                                {getTransactionCount(
                                  user.transactions.filter(
                                    (t) => t.type === "sell"
                                  ),
                                  "monthly"
                                )}
                              </td>
                              <td>
                                <Button
                                  variant="warning"
                                  size="sm"
                                  className="me-2 m-2"
                                >
                                  Edit
                                </Button>
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
                              <td>{stock.stockSymbol}</td>
                              <td>{stock.stockName}</td>
                              <td>
                                <Button
                                  variant="warning"
                                  size="sm"
                                  className="me-2"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => deleteStock(stock.id)}
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
        ) : (
          // User view: Personal details only
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="text-primary mb-3">Personal Details</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>John Doe</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>johndoe@example.com</td>
                  </tr>
                  <tr>
                    <th>Date of Birth</th>
                    <td>1990-05-15</td>
                  </tr>
                  <tr>
                    <th>PAN Number</th>
                    <td>ABCDE1234F</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </Container>

      {/* Modal for adding stock */}
      <Modal show={showAddStockModal} onHide={() => setShowAddStockModal(false)}>
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

            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newStock.price}
                onChange={handleInputChange}
              />
            </Form.Group>
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
