import React from "react";

const ResetFilters = ({ filters, setFilters, setActiveTab }) => {
    // Default filter values
    const defaultFilters = {
        global: "",
        gender: null,
        status: null,
        priority: null,
        category: null,
        committee: null,
        member: null,
        role: null,
    };

    // Determine whether the current filters match the default values
    const isActive = JSON.stringify(filters) !== JSON.stringify(defaultFilters);

    return (
        <React.Fragment>
            <button
                type="button"
                className={`btn ${isActive ? "btn-danger" : "btn-light"}`}
                onClick={() => {
                    setFilters(defaultFilters);
                    setActiveTab("0");
                }}
            >
                <i className="mdi mdi-filter-off-outline"></i>
            </button>
        </React.Fragment>
    );
};

export default ResetFilters;
