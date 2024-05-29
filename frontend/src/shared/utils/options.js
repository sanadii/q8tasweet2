import {
    // General
    GenderOptions, StatusOptions, PriorityOptions,
    // Election
    ElectionMethodOptions, ElectionResultOptions, ElectionSortingResultOptions, ElectionDetailedResultOptions,
    // Campaign
    CampaignGuaranteeStatusOptions,
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

const getOptionBadge = (optionCategory, status) => {
    console.log("optionCategory: ", optionCategory)
    console.log("optionCategory status: ", status)

    const selectedOption = getSelectedOptions(optionCategory);
    const entry = selectedOption.find(opt => opt.id === status);
    if (!entry) return null;

    return (
        <div className={`${entry.badgeClass} fs-10`}>
            {entry.name}
        </div>
    );
};

export { getSelectedOptions, getOptionOptions, getOptionBadge };
