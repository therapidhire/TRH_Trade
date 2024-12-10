import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BuySellModal.css";
import Header from "../../components/Header/Header";

const BuySellModal = () => {
  const { action, stock } = useParams(); // Fetch the action (buy/sell) and stock name from URL params
  const navigate = useNavigate();

  const stockData = JSON.parse(localStorage.getItem(action)); // Get stock data from localStorage based on action

  console.log("stock data-----", stockData);
  const stockName = stockData?.stockName || stockData?.name; // Fallback to stock name if not found in localStorage
  const availableQty = stockData?.stockQty || stockData?.quantity;
  const isinNumber = stockData?.isin_Num || stockData?.isinNumber; // Retrieve isinNumber from stockData
  const symbol = stockData?.stockSymbol || stockData?.symbol; // Retrieve symbol from stockData

  const [stockPrice, setStockPrice] = useState(""); // Initially empty
  const [qty, setQty] = useState(""); // Initially empty
  const [totalPrice, setTotalPrice] = useState(""); // Initially empty
  const [remainingStock, setRemainingStock] = useState(availableQty);
  const [description, setDescription] = useState("");
  const [accountType, setAccountType] = useState("corp");

  useEffect(() => {
    if (action === "sell") {
      setRemainingStock(availableQty);
    }
  }, [action, availableQty]);

  const handleQtyChange = (e) => {
    const newQty = e.target.value;
    // if (newQty < 0 || newQty > availableQty) return;

    setQty(newQty);
    if (stockPrice !== "") {
      setTotalPrice(newQty * stockPrice); // Recalculate total price when qty changes
    }
    if (action === "sell") {
      if(availableQty - newQty < 0){
        alert("You don't have enough stock to sell");
        setStockPrice("");
        setQty("");
        setTotalPrice("");
        // setRemainingStock(availableQty)
        navigate("/dashboard"); 
      }
      setRemainingStock(availableQty - newQty); // Decrease remaining stock for selling action
    }
  };

  const handleTotalPriceChange = (e) => {
    const newTotalPrice = e.target.value;
    setTotalPrice(newTotalPrice);
    if (stockPrice !== "") {
      setQty(newTotalPrice / stockPrice); // Recalculate quantity if total price changes
    }
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setStockPrice(newPrice);
    if (qty !== "") {
      setTotalPrice(qty * newPrice); // Recalculate total price when stock price changes
    }
  };

  const handleAccountChange = (e) => {
    setAccountType(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("buysellmodel symbol and isinnumber---", symbol);
    console.log("buysellmodel symbol and isinnumber---", isinNumber);
    const endpoint =
      action === "buy"
        ? "http://localhost:8080/api/transaction/postBuy"
        : "http://localhost:8080/api/transaction/postSale";

    const payload = {
      stockSymbol: symbol,
      stockName,
      stockQty: parseInt(qty, 10), // Ensure quantity is an integer
      stockPrice: parseFloat(stockPrice), // Ensure price is a float
      accountType,
      description: description.trim(), // Trim whitespace for cleaner input
      isin_Num: isinNumber, // Use fetched ISIN number
      userId: localStorage.getItem("userId") || "", // Fetch userId from localStorage
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("response--", response);
      if (!response.ok) {
        const error = await response.json();
        console.error("Error from server:", error);
        throw new Error(`Failed to ${action === "buy" ? "buy" : "sell"} stock`);
      }

      const result = await response.json();
      console.log(`${action === "buy" ? "Buy" : "Sell"} Success:`, result);

      alert(
        `${
          action === "buy" ? "Bought" : "Sold"
        } ${qty} shares of ${stockName} at ₹${stockPrice} successfully!`
      );

      localStorage.removeItem(action);
      navigate("/dashboard");
    } catch (error) {
      console.error("Transaction failed:", error.message);
      alert(
        `Error: Unable to ${
          action === "buy" ? "buy" : "sell"
        } the stock. Please try again.`
      );
    }
  };

  return (
    <>
      <Header />
      <div className="BuySellModelClass">
        <div className="modal-container">
          <div className="modal-box">
            <h2 className="modal-title">
              {action === "buy" ? "Buy" : "Sell"} Stock
            </h2>
            <div className="modal-content">
              <div className="stock-info">
                <span className="stock-name m-4">{stockName}</span>
              </div>
              <div className="d-flex flex-column">
                <div className="input-group">
                  <label className="input-label">Account Type</label>
                  <select
                    className="w-50 input-field"
                    value={accountType}
                    onChange={handleAccountChange}
                  >
                    <option value="personal">Personal Account</option>
                    <option value="corp">Corporate Account</option>
                    <option value="huf">HUF Account</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Qty.</label>
                  <input
                    className="input-field"
                    type="number"
                    value={qty}
                    onChange={handleQtyChange}
                    // min="1"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Price</label>
                  <input
                    className="input-field"
                    type="number"
                    value={stockPrice}
                    onChange={handlePriceChange}
                    placeholder="Enter stock price"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Total Amount</label>
                  <input
                    className="input-field"
                    type="number"
                    value={totalPrice}
                    onChange={handleTotalPriceChange}
                    placeholder="Enter total price"
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  className="input-field description-field"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder={`Reason for ${
                    action === "buy" ? "Buying" : "Selling"
                  }`}
                  rows="4"
                />
              </div>

              {action === "sell" && (
                <div className="input-group">
                  <label className="input-label">Remaining Stock</label>
                  <input
                    className="input-field"
                    type="number"
                    value={remainingStock}
                    disabled
                  />
                </div>
              )}

              <div className="actions">
                <button
                  className={`action-btn ${
                    action === "buy" ? "buy-btn" : "sell-btn"
                  }`}
                  onClick={handleSubmit}
                >
                  {action === "buy" ? "Buy" : "Sell"}
                </button>
                <button
                  className="cancel-btn"
                  style={{
                    backgroundColor:"black"
                  }}
                  onClick={() => {
                    localStorage.removeItem(action);
                    navigate("/dashboard");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuySellModal;
