import React from "react";
import { useSelector } from "react-redux";
import { campaignSelector } from 'selectors';


const GuaranteeAttendanceFilter = ({ filters, setFilters }) => {
    const campaignGuarantees = useSelector(campaignSelector);

    const AttendanceOptions = [
<<<<<<< HEAD
        { id: 'true', name: "حضر" },
        { id: 'false', name: "لم يحضر" },
    ];

    const ChangeGuaranteeAttendance = (e) => {
        const selectedAttendance = e === "true" ? true : e === "false" ? false : null;
=======
        { id: true, name: "حضر" },
        { id: false, name: "لم يحضر" },
    ];

    const ChangeGuaranteeAttendance = (e) => {
        const selectedAttendance = e === true ? true : false;
>>>>>>> sanad


        // Update the filters
        setFilters(prev => ({
            ...prev,
            attended: selectedAttendance,
        }));
    };

    return (
        <React.Fragment>
<<<<<<< HEAD
            <div className="col-lg-3 col-sm-2">
=======
            <div className="col-lg-2 col-sm-2">
>>>>>>> sanad
                <strong>التحضير</strong>
                <div className="input-light">
                    <select
                        className="form-select form-control"
                        name="choices-select-attendeed"
                        id="choices-select-attendeed"
                        onChange={(e) => ChangeGuaranteeAttendance(e.target.value)}
                        value={filters.attended === null ? '' : String(filters.attended)}
                    >
<<<<<<< HEAD
                        <option value="">- الكل - </option>
                        {AttendanceOptions.map((attendance) => (
                            <option key={attendance.id} value={attendance.id}>
=======
                        <option value={null}>- الكل - </option>
                        {AttendanceOptions.map((attendance) => (
                            <option
                                key={attendance.id}
                                value={attendance.id}>
>>>>>>> sanad
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
