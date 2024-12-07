import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./BuySellModal.css";
import Header from "../../components/Header/Header";

const BuySellModal = () => {
  const { action, stock } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get stock details from localStorage based on the action (buy or sell)
  const stockData = JSON.parse(localStorage.getItem(action)); // 'action' will be either 'buy' or 'sell'

  // For 'buy', we expect stock price, name, and quantity available
  const stockPrice = stockData?.price || 0;
  const stockName = stockData?.name || stock;
  const availableQty = stockData?.quantity || 0;

  const [qty, setQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [remainingStock, setRemainingStock] = useState(availableQty);
  const [description, setDescription] = useState("");
  const [accountType, setAccountType] = useState("personal");

  useEffect(() => {
    if (action === "sell") {
      // If it's a sell action, set the remaining stock quantity from localStorage
      setRemainingStock(availableQty);
    }
  }, [action, availableQty]);

  // Handle quantity input change
  const handleQtyChange = (e) => {
    const newQty = e.target.value;

    // Prevent negative or invalid inputs
    if (newQty < 0 || newQty > availableQty) {
      return;
    }

    setQty(newQty);
    setTotalPrice(newQty * stockPrice);

    if (action === "sell") {
      // Dynamically update remaining stock for the sell action
      setRemainingStock(availableQty - newQty);
    }
  };

  // Handle total price input change
  const handleTotalPriceChange = (e) => {
    const newTotalPrice = e.target.value;
    setTotalPrice(newTotalPrice);
    setQty(newTotalPrice / stockPrice);
  };

  // Handle account type change
  const handleAccountChange = (e) => {
    setAccountType(e.target.value);
  };

  // Handle description input change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (action === "buy") {
      alert(`Buying ${qty} shares of ${stockName} at price ₹${stockPrice}`);
      localStorage.removeItem("buy"); // Clear the "buy" key after the transaction
    } else if (action === "sell") {
      if (qty > remainingStock) {
        alert("You don't have enough stock to sell!");
        return;
      }
      alert(`Selling ${qty} shares of ${stockName} at price ₹${stockPrice}`);
      localStorage.removeItem("sell"); // Clear the "sell" key after the transaction
    }

    // Navigate to the dashboard
    navigate("/dashboard");
  };

  return (
    <>
      <Header />
      <div className="BuySellModelClass">
        <div className="modal-container">
          <div className="modal-box">
            <h2 className="modal-title">
              {action === "buy" ? "Buy" : "Sell"} {stockName}
            </h2>
            <div className="modal-content">
              <div className="stock-info">
                <span className="stock-name">{stockName}</span>
                <span className="stock-price">₹{stockPrice}</span>
              </div>

              {/* Account Type Options */}
              <div className="input-group account-type-group">
                <label className="input-label">Account Type</label>
                <div className="account-type-options">
                  <label>
                    <input
                      type="radio"
                      name="accountType"
                      value="personal"
                      checked={accountType === "personal"}
                      onChange={handleAccountChange}
                    />
                    Personal Ac
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="accountType"
                      value="corp"
                      checked={accountType === "corp"}
                      onChange={handleAccountChange}
                    />
                    Corp Ac
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="accountType"
                      value="huf"
                      checked={accountType === "huf"}
                      onChange={handleAccountChange}
                    />
                    HUF Ac
                  </label>
                </div>
              </div>

              {/* For Buy Action */}
              {action === "buy" && (
                <>
                  <div className="input-group">
                    <label className="input-label">Qty.</label>
                    <input
                      className="input-field"
                      type="number"
                      value={qty}
                      onChange={handleQtyChange}
                      min="1"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Total Price</label>
                    <input
                      className="input-field"
                      type="number"
                      value={totalPrice}
                      onChange={handleTotalPriceChange}
                      placeholder="Enter total price"
                    />
                  </div>
                </>
              )}

              {/* For Sell Action */}
              {/* For Sell Action */}
              {action === "sell" && (
                <>
                  <div className="input-group">
                    <label className="input-label">Qty.</label>
                    <input
                      className="input-field"
                      type="number"
                      value={qty}
                      onChange={handleQtyChange}
                      min="1"
                      max={availableQty}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Total Price</label>
                    <input
                      className="input-field"
                      type="number"
                      value={totalPrice}
                      onChange={handleTotalPriceChange}
                      placeholder="Enter total price"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Remaining Stock</label>
                    <input
                      className="input-field"
                      type="number"
                      value={remainingStock}
                      disabled
                    />
                  </div>
                </>
              )}

              {/* Reason for action */}
              <div className="input-group">
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

              {/* Buttons */}
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
