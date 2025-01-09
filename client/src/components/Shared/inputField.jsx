import React from "react";
import { Form } from "react-bootstrap";

const InputField = (props) => {
  const {
    labelName,
    inputType,
    inputId,
    inputName,
    placeholder,
    // inputStyle,
    labelStyle,
    values,
    inputHandleChange,
    isInvalid,
    invalidError,
  } = props;
  return (
    <div>
      {/* <label htmlFor="email" className={`form-label fw-semibold ${labelStyle}`}>
         {labelName}
      </label>
      <input
        type={inputType}
        id={inputId}
        name={inputName}
        placeholder={placeholder}
        className="form-control"
        value={values}
        onChange={inputHandleChange}
        // required
      /> */}
      <Form.Group className={`${labelStyle}`}>
        <Form.Label className=" fw-semibold">{labelName}</Form.Label>
        <Form.Control
          type={inputType}
          id={inputId}
          name={inputName}
          placeholder={placeholder}
          value={values}
          onChange={inputHandleChange}
          isInvalid={isInvalid}
        />
        <Form.Control.Feedback type="invalid">
          {invalidError}
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  );
};

export default InputField;
