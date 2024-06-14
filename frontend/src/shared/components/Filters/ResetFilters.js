import React from "react";

<<<<<<< HEAD
const ResetFilters = ({ setFilters, activeTab, setActiveTab }) => {

    return (
        <React.Fragment>
            <p></p>
            <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                    setFilters({
                        status: null,
                        priority: null,
                        category: null,
                        role: null,
                        gender: null,
                        member: null,
                        attended: null,
                        guaranteeStatus: null,
                        global: ""
                    });
                    // Need to specify it
                    setActiveTab("0");
                }}
            >
                <i className="ri-filter-2-line me-1 align-bottom"></i> إعادة
=======
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
>>>>>>> sanad
            </button>
        </React.Fragment>
    );
};

export default ResetFilters;
