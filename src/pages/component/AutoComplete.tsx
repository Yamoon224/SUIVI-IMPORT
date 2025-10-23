import React, { useState, useEffect } from "react";

interface Option {
  [key: string]: any;
}

interface AutoCompleteProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  displayField: (option: Option) => string;
  valueField: string;
  placeholder?: string;
  report?: string;
  disabled?: boolean;
  required?: boolean;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  displayField,
  valueField,
  placeholder,
  report,
  disabled,
  required
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const filteredOptions = options.filter((option) =>
    displayField(option).toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowOptions(true);
  };

  const handleOptionClick = (option: Option) => {
    setInputValue(displayField(option));
    onChange(option[valueField]);
    setShowOptions(false);
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        name={name}
        type="text"
        className={`form-control ${report ? "is-invalid" : ""}`}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
    {showOptions && filteredOptions.length > 0 && (
    <ul
      className="list-group position-absolute"
      style={{
        zIndex: 10,
        minWidth: "300px",    // largeur minimale
        maxWidth: "960px",    // largeur maximale
        width: "100%",        // ou "90%" pour réduire encore
        left: 10,
      }}
    >
      {filteredOptions.map((option) => (
        <li
          key={option[valueField]}
          className="list-group-item list-group-item-action"
          onMouseDown={() => handleOptionClick(option)}
          style={{ cursor: "pointer" }}
        >
          {displayField(option)}
        </li>
      ))}
    </ul>
  )}
      {report && <div className="invalid-feedback">{report}</div>}
    </div>
  );
};

export default AutoComplete;
