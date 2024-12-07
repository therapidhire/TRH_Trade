import React from "react";
import { Table, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { sortStocks } from "../../redux/slices/stocksSlice";

const TableComponent = ({ columns, columnKeys, data, buyButtonType, sellButtonType, onButtonClick }) => {
  const dispatch = useDispatch();

  const handleSort = (key) => {
    dispatch(sortStocks({ key }));
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              onClick={() => handleSort(columnKeys[index])}
              style={{ cursor: "pointer" }}
            >
              {column}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      {data.map((item, index) => (
            <tr key={item.id}>
              {columnKeys.map((key, idx) => (
                <td key={idx}>{item[key]}</td>
              ))}
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => onButtonClick(item, buyButtonType)}
                >
                  {buyButtonType}
                </button>
                <button
                  className="btn"
                  style={{
                    "background-color": "#f57300",
                    "fontWeight":"bold",
                    "color":"white"
                  }}
                  onClick={() => onButtonClick(item, sellButtonType)}
                >
                  {sellButtonType}
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default TableComponent;

