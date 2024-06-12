import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { campaignSelector } from 'selectors';


const GuarantorFilter = ({ filters, setFilters }) => {
    const { campaignMembers } = useSelector(campaignSelector);
    const [sortedGurantorOptions, setSortedGuarantorOptions] = useState([]);

    // TODO: make it more dymic, and remove the managers for the supervisor
    useEffect(() => {
        const GurantorOptions = campaignMembers.filter(
            (member) => member.role === 31 || member.role === 32 || member.role === 33 || member.role === 34
        );

        setSortedGuarantorOptions(campaignMembers.sort((a, b) => a.roleId - b.roleId));
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
            <div className="col-lg-2 col-sm-2">
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
                                {member.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </React.Fragment>
    );
};

export default GuarantorFilter;
