import React from "react";
import { useSelector } from "react-redux";
import { campaignSelector } from 'selectors';


const GuaranteeAttendanceFilter = ({ filters, setFilters }) => {
    const campaignGuarantees = useSelector(campaignSelector);

    const AttendanceOptions = [
        { id: true, name: "حضر" },
        { id: false, name: "لم يحضر" },
    ];

    const ChangeGuaranteeAttendance = (e) => {
        const selectedAttendance = e === true ? true : false;


        // Update the filters
        setFilters(prev => ({
            ...prev,
            attended: selectedAttendance,
        }));
    };

    return (
        <React.Fragment>
            <div className="col-lg-2 col-sm-2">
                <strong>التحضير</strong>
                <div className="input-light">
                    <select
                        className="form-select form-control"
                        name="choices-select-attendeed"
                        id="choices-select-attendeed"
                        onChange={(e) => ChangeGuaranteeAttendance(e.target.value)}
                        value={filters.attended === null ? '' : String(filters.attended)}
                    >
                        <option value={null}>- الكل - </option>
                        {AttendanceOptions.map((attendance) => (
                            <option
                                key={attendance.id}
                                value={attendance.id}>
                                {attendance.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </React.Fragment>
    );
};

export default GuaranteeAttendanceFilter;
