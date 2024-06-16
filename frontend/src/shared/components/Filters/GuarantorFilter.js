import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { campaignSelector } from 'selectors';


const GuarantorFilter = ({ filters, setFilters }) => {
    const { campaignMembers } = useSelector(campaignSelector);
<<<<<<< HEAD

    const [sortedGurantorOptions, setSortedGuarantorOptions] = useState([]);


=======
    const [sortedGurantorOptions, setSortedGuarantorOptions] = useState([]);

>>>>>>> sanad
    // TODO: make it more dymic, and remove the managers for the supervisor
    useEffect(() => {
        const GurantorOptions = campaignMembers.filter(
            (member) => member.role === 31 || member.role === 32 || member.role === 33 || member.role === 34
        );

<<<<<<< HEAD
        setSortedGuarantorOptions(GurantorOptions.sort((a, b) => a.role - b.role));
=======
        setSortedGuarantorOptions(campaignMembers.sort((a, b) => a.roleId - b.roleId));
>>>>>>> sanad
    }, [campaignMembers]);


    const ChangeGuaranteeRole = (e) => {
        const selectedRole = e.target.value ? parseInt(e.target.value, 10) : null;

        // Update the filters
        setFilters(prev => ({
            ...prev,
            member: selectedRole,
        }));
    };


    return (
        <React.Fragment>
<<<<<<< HEAD
            <div className="col-lg-3 col-sm-2">
=======
            <div className="col-lg-2 col-sm-2">
>>>>>>> sanad
                <strong>الضامن</strong>
                <div className="input-light">
                    <select
                        className="form-select form-control"
                        name="choices-select-guarantor"
                        id="choices-select-guarantor"
                        onChange={ChangeGuaranteeRole}
                        value={filters.member || ''}
                    >
                        <option value="">- الكل - </option>
                        {sortedGurantorOptions.map((member) => (
                            <option key={member.id} value={member.id}>
<<<<<<< HEAD
                                {member.fullName}
=======
                                {member.name}
>>>>>>> sanad
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </React.Fragment>
    );
};

export default GuarantorFilter;
