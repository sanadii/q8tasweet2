import React from "react";
import { StatusOptions } from "Components/constants";

const StatusFilter = ({ filters, setFilters }) => {
    const ChangeSelectedStatus = (e) => {
        const selectedStatusId = parseInt(e, 10);
        setFilters(prev => ({
            ...prev,
            status: selectedStatusId || null,
        }));
    };


    return (
        <React.Fragment>
            <div className="col-lg-3 col-sm-2">
                <strong>الحالة</strong>
                <div className="input-light">
                    <select
                        className="form-select form-control"
                        name="choices-select-status"
                        id="choices-select-status"
                        onChange={(e) => ChangeSelectedStatus(e.target.value)}
                        value={filters.status || ''}  // <-- This is the key change
                    >
                        <option value="">- جميع الحالات - </option>
                        {StatusOptions.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </React.Fragment>
    );
};

export default StatusFilter;
