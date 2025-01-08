import React from "react";

const InputField = (props) => {
  const {
    labelName,
    inputType,
    inputId,
    inputName,
    placholder,
    // inputStyle,
    labelStyle,
    values,
    inputHandleChange,
  } = props;
  return (
    <div>
      <label htmlFor="email" className={`form-label fw-semibold ${labelStyle}`}>
         {labelName}
      </label>
      <input
        type={inputType}
        id={inputId}
        name={inputName}
        placeholder={placholder}
        className="form-control"
        value={values}
        onChange={inputHandleChange}
        // required
      />
    </div>
  );
};

export default InputField;
