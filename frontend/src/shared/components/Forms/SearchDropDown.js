import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";

const SearchDropDown = ({ field, validation, onChangeHandler }) => {
  const { id, label, name, options, value, OptionCategories, onChange, onSelect } = field;

  // console.log("OptionCategories: ", OptionCategories);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleClientSelect = (client) => {
    onSelect(client); // Trigger the onSelect event handler
    setIsDropdownVisible(false); // Hide dropdown
  };

  const handleInputChange = (e) => {
    onChangeHandler(e);
    setIsDropdownVisible(e.target.value.length > 0);
  };

  const handleDocumentClick = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      inputRef.current &&
      !inputRef.current.contains(e.target)
    ) {
      setIsDropdownVisible(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      setIsDropdownVisible(false);
    }
  };

  const handleFocus = (event) => {
    event.target.focus();
    event.target.select();
    setIsDropdownVisible(true);
  };

  const toggleDropDown = () => {
    setIsDropdownVisible((prev) => !prev); // Toggle the visibility state
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="iconTextfieldModule">
        <a className="iconTextfieldIcon" onClick={() => toggleDropDown()}>
          <i className={isDropdownVisible ? "ri-arrow-up-s-line fs-24" : "ri-arrow-down-s-line fs-24"}></i>
        </a>

        <input
          type="text"
          id={id}
          name={name}
          className="form-control form-control-sm pe-4"
          placeholder={`Enter ${label}`}
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={validation.handleBlur}
        />
        {/* <div className={`arrow ${isDropdownVisible ? "up" : "down"}`}></div> */}
      </div>

      {validation.touched[name] && validation.errors[name] && (
        <div className="invalid-feedback">{validation.errors[name]}</div>
      )}

      <div
        className={`autocomplete-module_dropdownWrapper dropdown-menu dropdown-menu-lg ${isDropdownVisible ? "show" : ""
          }`}
        ref={dropdownRef}
      >
        {/* <SimpleBar style={{ height: "320px" }}>
          {OptionCategories &&
            OptionCategories.length > 0 &&
            OptionCategories.map((category) => (
              <ul className="autocomplete-module_list">
                <li className="autocomplete-module_itemCategory" style={{ paddingLeft: "8px" }}>
                  {category.label}
                </li>
                {category?.options &&
                  category?.options.map((option) => (
                    <li
                      key={option.id}
                      onClick={() => handleClientSelect(option)}
                      role="option"
                      aria-selected="false"
                      className="autocomplete-module_item"
                      style={{ paddingLeft: "22px" }}
                    >
                      <span>{option.label}</span>
                    </li>
                  ))}
              </ul>
            ))}

          {options &&
            options.map((option) => (
              <div key={option.id} onClick={() => handleClientSelect(option)}>
                <Link to="#">
                  <strong>{option.name}</strong> {option.mobile}
                </Link>
              </div>
            ))}
        </SimpleBar> */}
      </div>
    </React.Fragment>
  );
};

export default SearchDropDown;
