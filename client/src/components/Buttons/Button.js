import React from "react";
import PropTypes from "prop-types";
import "./Button.css";

const Button = ({ content, onClick, styleClass }) => {
  return (
    <button className={`btn ${styleClass}`} onClick={onClick}>
      {content}
    </button>
  );
};

Button.propTypes = {
  content: PropTypes.string.isRequired, // Text displayed on the button
  onClick: PropTypes.func,             // Event handler for button clicks
  styleClass: PropTypes.string,        // Custom Bootstrap or other classes
};

Button.defaultProps = {
  onClick: () => {}, // Default no-op function
  styleClass: "btn-primary", // Default Bootstrap class
};

export default Button;
