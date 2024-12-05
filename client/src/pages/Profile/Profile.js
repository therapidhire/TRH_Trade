import React from "react";
import { Card, Container, Row, Col, Table } from "react-bootstrap";
import Header from "../../components/Header/Header";

const userDetails = {
  name: "John Doe",
  email: "johndoe@example.com",
  dob: "1990-05-15",
  panNumber: "ABCDE1234F",
  linkedBank: {
    name: "State Bank of India",
    accountName: "John Doe",
    accountNumber: "123456789012",
  },
  debitCard: {
    cardNumber: "1234 5678 9012 3456",
    expiryDate: "12/25",
  },
  walletBalance: 5000.0, // Remaining money
};

const Profile = () => {
  return (
    <>
    <Header/>
    <Container className="mt-5">
      <h2 className="text-center mb-4">User Profile</h2>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="text-primary mb-3">Personal Details</h5>
          <Table bordered>
            <tbody>
              <tr>
                <th>Name</th>
                <td>{userDetails.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{userDetails.email}</td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>{userDetails.dob}</td>
              </tr>
              <tr>
                <th>PAN Number</th>
                <td>{userDetails.panNumber}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="text-primary mb-3">Bank Details</h5>
          <Table bordered>
            <tbody>
              <tr>
                <th>Linked Bank</th>
                <td>{userDetails.linkedBank.name}</td>
              </tr>
              <tr>
                <th>Account Name</th>
                <td>{userDetails.linkedBank.accountName}</td>
              </tr>
              <tr>
                <th>Account Number</th>
                <td>{userDetails.linkedBank.accountNumber}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="text-primary mb-3">Debit Card Details</h5>
          <Table bordered>
            <tbody>
              <tr>
                <th>Card Number</th>
                <td>{userDetails.debitCard.cardNumber}</td>
              </tr>
              <tr>
                <th>Expiry Date</th>
                <td>{userDetails.debitCard.expiryDate}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="text-primary mb-3">Wallet Balance</h5>
          <p className="fs-5 text-success">
            <strong>${userDetails.walletBalance.toFixed(2)}</strong>
          </p>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
};

export default Profile;
