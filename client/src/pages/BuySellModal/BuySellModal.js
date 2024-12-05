import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BuySellModal.css";
import Header from "../../components/Header/Header";

const BuySellModal = () => {
  const { action, stock } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [triggerPrice, setTriggerPrice] = useState(0);
  const [validity, setValidity] = useState("Day");
  const [orderType, setOrderType] = useState("Market");

  const handleSubmit = () => {
    alert(`${action} ${qty} shares of ${stock} at price ₹${price}`);
    navigate("/dashboard");
  };

  return (
    <>
    <Header />
    <div className="BuySellModelClass">
    <div className="modal-container">
      <div className="modal-box">
        <h2 className="modal-title">{action === "buy" ? "Buy" : "Sell"} {stock}</h2>
        <div className="modal-content">
          <div className="stock-info">
            <span className="stock-name">{stock}</span>
            <span className="stock-price">₹{price}</span>
          </div>

          {/* Quantity Input */}
          <div className="input-group">
            <label className="input-label">Qty.</label>
            <input
              className="input-field"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              min="1"
            />
          </div>

          {/* Price Inputs */}
          <div className="input-group">
            <label className="input-label">Price</label>
            <input
              className="input-field"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>

          {/* Trigger Price */}
          <div className="input-group">
            <label className="input-label">Trigger Price</label>
            <input
              className="input-field"
              type="number"
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
              placeholder="Enter trigger price"
            />
          </div>

          {/* Order Type */}
          <div className="radio-group">
            <label className="radio-label">Order Type</label>
            <div>
              <input
                className="radio-input"
                type="radio"
                id="market"
                name="orderType"
                value="Market"
                checked={orderType === "Market"}
                onChange={() => setOrderType("Market")}
              />
              <label htmlFor="market">Market</label>
              <input
                className="radio-input"
                type="radio"
                id="limit"
                name="orderType"
                value="Limit"
                checked={orderType === "Limit"}
                onChange={() => setOrderType("Limit")}
              />
              <label htmlFor="limit">Limit</label>
            </div>
          </div>

          {/* Validity */}
          <div className="radio-group">
            <label className="radio-label">Validity</label>
            <div>
              <input
                className="radio-input"
                type="radio"
                id="day"
                name="validity"
                value="Day"
                checked={validity === "Day"}
                onChange={() => setValidity("Day")}
              />
              <label htmlFor="day">Day</label>
              <input
                className="radio-input"
                type="radio"
                id="ioc"
                name="validity"
                value="IOC"
                checked={validity === "IOC"}
                onChange={() => setValidity("IOC")}
              />
              <label htmlFor="ioc">IOC</label>
              <input
                className="radio-input"
                type="radio"
                id="minutes"
                name="validity"
                value="Minutes"
                checked={validity === "Minutes"}
                onChange={() => setValidity("Minutes")}
              />
              <label htmlFor="minutes">Minutes</label>
            </div>
          </div>

          {/* Buttons */}
          <div className="actions">
            <button
              className={`action-btn ${action === "buy" ? "buy-btn" : "sell-btn"}`}
              onClick={handleSubmit}
            >
              {action === "buy" ? "Buy" : "Sell"}
            </button>
            <button className="cancel-btn" onClick={() => navigate("/dashboard")}>
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
