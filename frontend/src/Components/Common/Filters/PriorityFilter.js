import React from "react";
import { PriorityOptions } from "Components/constants";


const PriorityFilter = ({ filters, setFilters }) => {
    const ChangeSelectedPriority = (e) => {
        const selectedPriorityId = parseInt(e, 10);
        setFilters(prev => ({
            ...prev,
            priority: selectedPriorityId || null,
        }));
    };

    return (
        <React.Fragment>
            <div className="col-lg-3 col-sm-2">
                <strong>الأوليات</strong>
                <div className="input-light">
                    <select
                        className="form-select form-control"
                        aria-label=".form-select-sm example"
                        name="choices-select-priority"
                        id="choices-select-priority"
                        onChange={(e) => ChangeSelectedPriority(e.target.value)}
                        value={filters.priority || ''}  // <-- This is the key change
                    >
                        <option value="">- جميع الأوليات - </option>
                        {PriorityOptions.map((priority) => (
                            <option key={priority.id} value={priority.id}>
                                {priority.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </React.Fragment>
    );
};

export default PriorityFilter;
