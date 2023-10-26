import React from "react";

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
            </button>
        </React.Fragment>
    );
};

export default ResetFilters;
