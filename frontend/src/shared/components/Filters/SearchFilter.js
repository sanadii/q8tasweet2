import React from "react";

const SearchFilter = ({ filters, setFilters, searchField }) => {
    const handleSearchChange = (e) => {
      const value = e.target.value;
      setFilters(prevFilters => ({
        ...prevFilters,
        [searchField]: value
      }));
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder={`Search by ${searchField}`}
          value={filters[searchField] || ''}
          onChange={handleSearchChange}
        />
      </div>
    );
  };

  export default SearchFilter;
