import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import "./BuySellModal.css";
import Header from "../../components/Header/Header";
import axiosInstance from "../../components/Axios/interseptor";
import { showToast } from "../../components/Toast/index";
import { useAuth } from "../../context/AuthProvider";

const BuySellModal = () => {
  const { action, stock } = useParams();
  const navigate = useNavigate();

  const stockData = JSON.parse(sessionStorage.getItem(action));
  const stockId = stockData?._id;
  const auth = useAuth();
  const userId = auth?.user?.userId;

  const [singleStock, setSingleStock] = useState({});
  const [availableQty, setAvailableQty] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [stockPrice, setStockPrice] = useState("");
  const [qty, setQty] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [remainingStock, setRemainingStock] = useState(0);
  const [description, setDescription] = useState("");
  const [accountType, setAccountType] = useState("Corporate Account");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStockDetails = async () => {
      // setIsLoading(true);
      try {
        if(!stockId){
          return showToast(`Insufficient stock quantity`, "warning");

        }
        const { data: stockResponse } = await axiosInstance.get(
          `/stock-transactions/${stockId}`,
          {
            headers: { userId },
          }
        );

        const stockData = stockResponse.transaction;
        if (action === "sell") {
          if (!stockData || stockData.Quantity <= 0) {
            setShowPopup(true);
          } else {
            setAvailableQty(stockData.Quantity);
            setSingleStock(stockData);
            setRemainingStock(stockData.Quantity);
          }
        } else {
          // For buy action
          setSingleStock(stockData || {});
        }
      } catch (error) {
        // toast.error("Error fetching stock details");
        showToast(`Insufficient stock quantity`, "error");

        if (action === "sell") {
          setShowPopup(true);
        }
      }
    };

    if (stockId) fetchStockDetails();
  }, [stockId, action, userId]);

  const handleQtyChange = (e) => {
    const newQty = Number(e.target.value);
    setQty(newQty);

    if (stockPrice !== "") {
      setTotalPrice(newQty * stockPrice);
    }

    if (action === "sell" && newQty > availableQty) {
      showToast(`Insufficient stock quantity`, "warning");
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

  const resetForm = () => {
    setStockPrice("");
    setQty("");
    setTotalPrice("");
    setRemainingStock(availableQty);
  };

  const handleSubmit = async () => {
    try {

      if(!stockPrice || !qty || !description) {
        return showToast(`All fields are required`, "warning");
      }
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

      const response = await axiosInstance.post("/stock-transactions", payload);
      showToast(
        `${action === "buy" ? "Bought" : "Sold"} ${qty} shares successfully!`,
        "success"
      );
      sessionStorage.removeItem(action);
      navigate("/dashboard");
    } catch (error) {
      showToast(
        `Transaction failed: ${
          error.response?.data?.message || "Please try again"
        }`,
        "error"
      );
    }
  };

  const handleBuyAction = () => {
    sessionStorage.setItem("buy", JSON.stringify(stockData));
    sessionStorage.removeItem("sell");
    navigate(`/trade/buy/${stockData.StockName}`);
  };

  return (
    <>
      <Header />
      <div className="d-flex flex-column align-items-center">
        <div className="shadow-lg rounded w-50 p-4">
          <div className="">
            <h2 className="text-center fw-bold ">
              {action === "buy" ? "Buy" : "Sell"} Stock
            </h2>
            <p className="fs-5 fw-bold">
              {singleStock?.StockId?.StockName ||
                stockData?.StockName ||
                "Loading..."}
            </p>
            <div>
              <div className="row g-3 py-2">
                <div class="col-md-6">
                  <label for="accountType" class="form-label">
                    Account Type
                  </label>
                  <select
                    className="form-select "
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                  >
                    <option value="Personal Account">Personal Account</option>
                    <option value="Corporate Account">Corporate Account</option>
                    <option value="HUF Account">HUF Account</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="qty" class="form-label">
                    Qty.
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    id="qty"
                    value={qty}
                    onChange={handleQtyChange}
                  />
                </div>
              </div>

              <div className="row g-3">
                <div class="col-md-6">
                  <label for="Price" class="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    id="Price"
                    value={stockPrice}
                    onChange={handlePriceChange}
                    placeholder="Enter stock price"
                  />
                </div>
                <div class="col-md-6">
                  <label for="totalAmount" class="form-label">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    id="totalAmount"
                    value={totalPrice}
                    onChange={handleTotalPriceChange}
                    placeholder="Enter total price"
                  />
                </div>
              </div>
            </div>
            {action === "sell" && (
              <div className="row pt-2">
                <div class="col-md-6">
                  <label for="Price" class="form-label">
                    Remaining Stock
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    id="Price"
                    value={remainingStock}
                    disabled
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <label for="description" class="form-label">
                Description
              </label>
              <textarea
                class="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Reason for ${
                  action === "buy" ? "Buying" : "Selling"
                }`}
                // id="floatingTextarea"
              ></textarea>
            </div>
            <div className="d-flex justify-content-center pt-4 g-3">
              <button
                className="py-1 text-white btn flex-fill"
                style={{ backgroundColor: "#f57300" }}
                onClick={handleSubmit}
              >
                {action === "buy" ? "Buy" : "Sell"}
              </button>
              <button
                className="py-1 bg-black text-white ms-3 btn flex-fill"
                onClick={() => {
                  sessionStorage.removeItem(action);
                  navigate("/dashboard");
                }}
              >
                Cancel
              </button>
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
              <h1 className="popup-title">Buy Alert</h1>
              <p className="popup-message">
                No stock found for the selected company.
              </p>
              <p className="popup-message">
                Please buy stock before proceeding with the sell action.
              </p>
              <button
                className="action-btn"
                onClick={() => {
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
