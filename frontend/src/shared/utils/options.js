import {
    // General
    GenderOptions, StatusOptions, PriorityOptions,
    // Election
    ElectionMethodOptions, ElectionResultOptions, ElectionSortingResultOptions, ElectionDetailedResultOptions,
    // Campaign
    CampaignGuaranteeStatusOptions,
    // Electors
    ElectorAttendanceOption,
} from "shared/constants";

const allOptions = {
    status: StatusOptions,
    priority: PriorityOptions,
    gender: GenderOptions,
    electionMethod: ElectionMethodOptions,
    electionResult: ElectionResultOptions,
    electionSortingResult: ElectionSortingResultOptions,
    electionDetailedResult: ElectionDetailedResultOptions,
    campaignGuaranteeStatus: CampaignGuaranteeStatusOptions,
    electorAttendanceOption: ElectorAttendanceOption,
};

const getSelectedOptions = (optionCategory) => {
    return allOptions[optionCategory] || [];
};

const getOptionOptions = (optionCategory) => {
    const selectedOption = getSelectedOptions(optionCategory);
    return selectedOption.map(item => ({
        id: item.id,
        label: item.name,
        value: item.value
    }));
};

const getOptionBadge = (optionCategory, status, checkValue) => {
    console.log("optionCategory: ", optionCategory);
    console.log("optionCategory status: ", status);

    const selectedOption = getSelectedOptions(optionCategory);
    let entry;
    if (checkValue) {
        entry = selectedOption.find(opt => opt.value === status);
        return (
            <div className={`${entry.badgeClass} fs-10`}>
                {entry.name}
            </div>
        );
    } else {
        entry = selectedOption.find(opt => opt.id === status);
        return (
            <div className={`${entry.badgeClass} fs-10`}>
                {entry.name}
            </div>
        );
    }
    if (!entry) return null;


};


export { getSelectedOptions, getOptionOptions, getOptionBadge };
