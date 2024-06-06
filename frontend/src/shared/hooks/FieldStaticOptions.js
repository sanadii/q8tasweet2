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


const getSelectedOptions = (optionCategory) => {
    const allOptions = {
        StatusOptions: StatusOptions,
        PriorityOptions: PriorityOptions,
        GenderOptions: GenderOptions,
        electionMethod: ElectionMethodOptions,
        electionResult: ElectionResultOptions,
        electionSortingResult: ElectionSortingResultOptions,
        electionDetailedResult: ElectionDetailedResultOptions,
        campaignGuaranteeStatus: CampaignGuaranteeStatusOptions,
        electorAttendanceOption: ElectorAttendanceOption,
    };
    return allOptions[optionCategory] || [];
};

const getFieldStaticOptions = (optionCategory) => {
    const selectedOption = getSelectedOptions(optionCategory);
    return selectedOption.map(item => ({
        id: item.id,
        label: item.name,
        value: item.value
    }));
};

const getOptionBadge = (optionCategory, optionValue, constantValue = false) => {

    const selectedOption = getSelectedOptions(optionCategory);

    const entry = constantValue ?
        selectedOption.find(opt => opt.value === optionValue) :
        selectedOption.find(opt => opt.id === optionValue);

    // console.log("optionCategory: ", optionCategory, "optionValue: ", optionValue, "constantValue: ", constantValue, "entry: ", entry);
    const entryBadgeClass = entry?.badgeClass ? entry?.badgeClass : ''
    const entryName = entry?.name ? entry?.name : ''

    return (
        <div className={`${entryBadgeClass} fs-10`}>
            {entryName}
        </div>
    );
};


export { getSelectedOptions, getFieldStaticOptions, getOptionBadge };
