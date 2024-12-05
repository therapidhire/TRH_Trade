import React from "react";
import { Table, Button } from "react-bootstrap";

const TableComponent = ({ columns,columnKeys, data, buttonType, onButtonClick }) => {
  console.log("Columns:", columns); // Log columns to check their structure
  console.log("Data:", data); // Log data to check its structure

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, index) => (
            <tr key={index}>
              {columnKeys.map((column, columnIndex) => (
                <td key={columnIndex}>
                  {/* Ensure that the value exists and handle undefined */}
                  {row[column] !== undefined ? row[column] : "N/A"}
                </td>
              ))}
              <td>
                <Button
                  style={{
                    backgroundColor: "#f57300",
                    border: "none",
                    fontWeight: "bold",
                  }}
                  onClick={() => onButtonClick(row)}
                >
                  {buttonType === "sell" ? "Sell" : "Buy"}
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + 1} className="text-center">
              No data found matching the filters.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TableComponent;
