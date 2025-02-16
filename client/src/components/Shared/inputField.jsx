import React from "react";
import { Form } from "react-bootstrap";

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
    isInvalid,
    invalidError
  } = props;
  return (
    <div>
      <Form.Group className={`${labelStyle}`}>
        <Form.Label className=" fw-semibold">{labelName}</Form.Label>
        <Form.Control
          type={inputType}
          id={inputId}
          name={inputName}
          placeholder={placholder}
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
