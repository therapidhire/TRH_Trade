import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./BuySellModal.css";
import Header from "../../components/Header/Header";
import axios from "axios";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  accountType: Yup.string().required("Account type is required"),
  qty: Yup.number()
    .required("Quantity is required")
    .integer("Shares must be whole numbers")
    .min(1, "Minimum 1 share required"),
  stockPrice: Yup.number()
    .required("Price is required")
    .min(0.01, "Price must be greater than 0"),
  description: Yup.string().required("Description is required"),
});

const BuySellModal = () => {
  const { action, stock } = useParams();
  const navigate = useNavigate();
  const [singleStock, setSingleStock] = useState({});
  const [availableQty, setAvailableQty] = useState();
  const [showPopup, setShowPopup] = useState(false);

  const stockData = JSON.parse(localStorage.getItem(action));
  const stockId = stockData?._id;
  const userId = localStorage.getItem("userId");

  const formik = useFormik({
    initialValues: {
      accountType: "Corporate Account",
      qty: "",
      stockPrice: "",
      totalPrice: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const stockResponse = await axios.get(
          `http://localhost:8080/api/stock-transactions/${stockId}`,
          { headers: { userId } }
        );

        const responseData = stockResponse.data;
        
        if (!responseData.success) {
          if (action === "sell") setShowPopup(true);
          return;
        }

        const stockData = responseData.transaction;
        if (action === "sell" && (!stockData || stockData.Quantity <= 0)) {
          setShowPopup(true);
        } else {
          setAvailableQty(stockData.Quantity);
          setSingleStock(stockData);
        }
      } catch (error) {
        console.error("Error fetching stock details:", error);
        if (action === "sell") setShowPopup(true);
      }
    };

    if (stockId) fetchStockDetails();
    if (action === "sell") formik.setFieldValue("remainingStock", availableQty);
  }, [stockId, action, availableQty]);

  useEffect(() => {
    if (formik.values.qty && formik.values.stockPrice) {
      const total = formik.values.qty * formik.values.stockPrice;
      formik.setFieldValue("totalPrice", total.toFixed(2));
    }
  }, [formik.values.qty, formik.values.stockPrice]);

  const handleSubmit = async (values) => {
    const endpoint = "http://localhost:8080/api/stock-transactions";
    const payload = {
      StockId: stockId,
      UserId: userId,
      TransactionType: action,
      Price: values.stockPrice,
      Quantity: values.qty,
      AccountType: values.accountType,
      Reason: values.description,
      CreatedBy: userId,
    };

    try {
      await axios.post(endpoint, payload);
      toast.success(`${action === "buy" ? "Bought" : "Sold"} ${values.qty} shares of ${
        singleStock?.StockId?.StockName || "stock"
      } at ₹${values.stockPrice} successfully!`);
      
      localStorage.removeItem(action);
      navigate("/dashboard");
    } catch (error) {
      console.error("Transaction failed:", error.response?.data || error.message);
      toast.error(`Error: Unable to ${action}. Please try again.`);
    }
  };

  const handleBuyAction = () => {
    localStorage.setItem("buy", JSON.stringify(stockData));
    localStorage.removeItem("sell");
    navigate(`/trade/buy/${stockData.StockName}`);
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
            <form onSubmit={formik.handleSubmit}>
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
                      className="input-field"
                      name="accountType"
                      value={formik.values.accountType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="Personal Account">Personal Account</option>
                      <option value="Corporate Account">Corporate Account</option>
                      <option value="HUF Account">HUF Account</option>
                    </select>
                    {formik.touched.accountType && formik.errors.accountType && (
                      <div className="error-message" style={{ color: 'red' }}>
                        {formik.errors.accountType}
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Qty.</label>
                    <input
                      className="input-field"
                      type="number"
                      name="qty"
                      value={formik.values.qty}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.qty && formik.errors.qty && (
                      <div className="error-message" style={{ color: 'red' }}>
                        {formik.errors.qty}
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Price</label>
                    <input
                      className="input-field"
                      type="number"
                      name="stockPrice"
                      value={formik.values.stockPrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter stock price"
                    />
                    {formik.touched.stockPrice && formik.errors.stockPrice && (
                      <div className="error-message" style={{ color: 'red' }}>
                        {formik.errors.stockPrice}
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Total Amount</label>
                    <input
                      className="input-field"
                      type="number"
                      name="totalPrice"
                      value={formik.values.totalPrice}
                      disabled
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Description</label>
                  <textarea
                    className="input-field description-field"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={`Reason for ${action === "buy" ? "Buying" : "Selling"}`}
                    rows="4"
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="error-message" style={{ color: 'red' }}>
                      {formik.errors.description}
                    </div>
                  )}
                </div>

                {action === "sell" && (
                  <div className="input-group">
                    <label className="input-label">Remaining Stock</label>
                    <input
                      className="input-field"
                      type="number"
                      value={availableQty - formik.values.qty || availableQty}
                      disabled
                    />
                  </div>
                )}

                <div className="actions">
                  <button
                    type="submit"
                    className={`action-btn ${action === "buy" ? "buy-btn" : "sell-btn"}`}
                  >
                    {action === "buy" ? "Buy" : "Sell"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    style={{ backgroundColor: "black" }}
                    onClick={() => {
                      localStorage.removeItem(action);
                      navigate("/dashboard");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Existing popup code - unchanged */}
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
