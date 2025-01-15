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
<<<<<<< HEAD
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
=======
>>>>>>> bad1ca07d7f161c3f6a4a4f8bf7ad7a1afe0dc60
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
