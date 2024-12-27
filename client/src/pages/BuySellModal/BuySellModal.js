import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BuySellModal.css";
import Header from "../../components/Header/Header";
import axios from "axios";

const BuySellModal = () => {
  const { action, stock } = useParams(); // Fetch action (buy/sell) and stock name from URL params
  const navigate = useNavigate();
  const [singleStock, setSingleStock] = useState({});
  const [availableQty, setAvailableQty] = useState();
  const [showPopup, setShowPopup] = useState(false); // State for controlling popup visibility

  const stockData = JSON.parse(localStorage.getItem(action)); // Get stock data from localStorage based on action
  const stockId = stockData?._id;
  const userId = localStorage.getItem("userId");

  const [stockPrice, setStockPrice] = useState("");
  const [qty, setQty] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [remainingStock, setRemainingStock] = useState(availableQty);
  const [description, setDescription] = useState("");
  const [accountType, setAccountType] = useState("Corporate Account");


  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const stockResponse = await axios.get(
          `http://localhost:8080/api/stock-transactions/${stockId}`,
          {
            headers: {
              userId: userId,
            },
          }
        );
  
        const responseData = stockResponse.data;
        console.log("Response Data:--", responseData);
  
        if (!responseData.success) {
          console.warn("Stock not found or other issue:", responseData.message);
  
          if (action === "sell") {
            setShowPopup(true); // Show popup for sell action when stock is not found
          }
  
          return; // Stop further processing
        }
  
        const stockData = responseData.transaction;
  
        if (action === "sell" && (!stockData || stockData.Quantity <= 0)) {
          setShowPopup(true); // No stock found or quantity is zero, show popup
        } else {
          setAvailableQty(stockData.Quantity);
          setSingleStock(stockData);
        }
      } catch (error) {
        console.error("Error fetching stock details:", error);
  
        if (action === "sell") {
          setShowPopup(true); // Show popup only for sell action on error
        }
      }
    };
  
    if (stockId) fetchStockDetails();
    if (action === "sell") setRemainingStock(availableQty);
  }, [stockId, action, availableQty]);
  // 


  const handleQtyChange = (e) => {
    const newQty = Number(e.target.value);
    setQty(newQty);

    if (stockPrice !== "") {
      setTotalPrice(newQty * stockPrice);
    }

    if (action === "sell" && newQty > availableQty) {
      alert("You don't have enough stock to sell");
      resetForm();
    } else if (action === "sell") {
      setRemainingStock(availableQty - newQty);
    }
  };

  const handlePriceChange = (e) => {
    const newPrice = Number(e.target.value);
    setStockPrice(newPrice);

    if (qty !== "") {
      setTotalPrice(qty * newPrice);
    }
  };

  const handleTotalPriceChange = (e) => {
    const newTotalPrice = Number(e.target.value);
    setTotalPrice(newTotalPrice);

    if (stockPrice !== "") {
      setQty(newTotalPrice / stockPrice);
    }
  };

  const handleAccountChange = (e) => setAccountType(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const resetForm = () => {
    setStockPrice("");
    setQty("");
    setTotalPrice("");
    setRemainingStock(availableQty);
  };

  const handleSubmit = async () => {
    const endpoint = "http://localhost:8080/api/stock-transactions";

    const payload = {
      StockId: stockId,
      UserId: userId,
      TransactionType: action,
      Price: stockPrice,
      Quantity: qty,
      AccountType: accountType,
      Reason: description,
      CreatedBy: userId,
    };

    try {
      const response = await axios.post(endpoint, payload);

      console.log(
        `${action === "buy" ? "Buy" : "Sell"} Success:`,
        response.data
      );

      alert(
        `${action === "buy" ? "Bought" : "Sold"} ${qty} shares of ${
          singleStock?.StockId?.StockName || "stock"
        } at ₹${stockPrice} successfully!`
      );

      localStorage.removeItem(action);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Transaction failed:",
        error.response?.data || error.message
      );
      alert(`Error: Unable to ${action}. Please try again.`);
    }
  };
  const handleBuyAction = ()=>{
    localStorage.setItem("buy", JSON.stringify(stockData));
    localStorage.removeItem("sell");
    navigate(`/trade/buy/${stockData.StockName}`);


  }

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
                <span className="stock-name m-4">
                  {singleStock?.StockId?.StockName ||
                    stockData?.StockName ||
                    "Loading..."}
                </span>
              </div>
              <div className="d-flex flex-column">
                <div className="input-group">
                  <label className="input-label">Account Type</label>
                  <select
                    className="w-50 input-field"
                    value={accountType}
                    onChange={handleAccountChange}
                  >
                    <option value="Personal Account">Personal Account</option>
                    <option value="Corporate Account">Corporate Account</option>
                    <option value="HUF Account">HUF Account</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Qty.</label>
                  <input
                    className="input-field"
                    type="number"
                    value={qty}
                    onChange={handleQtyChange}
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
                    backgroundColor: "black",
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
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <button
                className="popup-close"
                onClick={() => {
                  setShowPopup(false);
                  navigate("/dashboard");
                }}
              >
                &times;
              </button>
              <h1
                style={{
                  fontSize: "1.5rem",
                  color: "#ee7740",
                  fontWeight: "700",
                  marginBottom: "40px",
                }}
              >
                Buy Alert
              </h1>
              <p
                style={{
                  color: "#1d7ef2",
                  fontWeight:"500"
                }}
              >
                No stock found for the selected company.
              </p>
              <p
                style={{
                  color: "#1d7ef2",
                  fontWeight:"500"
                }}
              >
                Please buy stock before proceeding with the sell action.
              </p>
              <button
                className="action-btn"
                style={{
                  marginTop: "20px",
                }}
                onClick={() => {
                  // // setShowPopup(false);
                  // navigate(`/trade/buy/${stockData.StockName}`);
                  handleBuyAction();
                  setShowPopup(false);
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BuySellModal;
