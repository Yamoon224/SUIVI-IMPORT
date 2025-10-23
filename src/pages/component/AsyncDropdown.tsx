import React from "react";
import AsyncSelect from "react-select/async";

interface AsyncDropdownProps {
  label: string;
  name: string;
  loadOptions: (inputValue: string, callback: (options: any[]) => void) => void;
  value: any;
  onChange: (selectedOption: any) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  report?: string;
}

const AsyncDropdown: React.FC<AsyncDropdownProps> = ({
  label,
  name,
  loadOptions,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  report,
}) => {
  return (
    <div className="form-group mb-3">
      <label htmlFor={name}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Choisir..."}
        isDisabled={disabled}
      />
      {report && <small className="text-danger">{report}</small>}
    </div>
  );
};

export default AsyncDropdown;
