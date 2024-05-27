// campaignCalculation.js

import { CampaignGuaranteeStatusOptions, STATUS_MAP } from "shared/constants";

// Helper function to calculate percentage
export const calculatePercentage = (count, total) => {
    const percentage = (count / total) * 100;
    return isNaN(percentage) ? 0 : parseFloat(percentage.toFixed(1));
};

// Function to calculate campaign data
export const calculateCampaignData = (campaignDetails, campaignGuarantees) => {
    const statusCounts = {};
    const attendeesStatusCounts = {};

    CampaignGuaranteeStatusOptions.forEach(option => {
        statusCounts[option.value] = 0;
        attendeesStatusCounts[option.value] = 0;
    });

    let targetVotes = campaignDetails.targetVotes;
    let totalGuarantees = campaignGuarantees.length || 0;
    let totalContactedGuarantees = 0;
    let totalConfirmedGuarantees = 0; // Contacted + Confirmed
    let totalConfirmedAttendees = 0;
    let totalAttendees = 0;

    campaignGuarantees.forEach(guarantee => {
        const statusOption = CampaignGuaranteeStatusOptions.find(option => option.id === guarantee.status);
        if (statusOption) {
            statusCounts[statusOption.value]++;
            if (guarantee.attended) {
                totalAttendees++;
                attendeesStatusCounts[statusOption.value]++;
            }
        }
        if (guarantee.status === STATUS_MAP.Contacted || guarantee.status === STATUS_MAP.Confirmed) {
            totalContactedGuarantees++;
        }
        if (guarantee.status === STATUS_MAP.Confirmed) {
            totalConfirmedGuarantees++;
        }
        if (guarantee.status === STATUS_MAP.Confirmed && guarantee.attended === true) {
            totalConfirmedAttendees++;
        }
    });

    const statusPercentages = {};
    const attendeesStatusPercentages = {};

    Object.keys(statusCounts).forEach(status => {
        statusPercentages[status] = calculatePercentage(statusCounts[status], totalGuarantees);
        attendeesStatusPercentages[status] = calculatePercentage(attendeesStatusCounts[status], totalAttendees);
    });

    return {
        targetVotes,
        totalGuarantees,
        totalContactedGuarantees,
        totalConfirmedGuarantees,
        totalConfirmedAttendees,
        totalAttendees,

        statusCounts,
        attendeesStatusCounts,
        statusPercentages,
        attendeesStatusPercentages,
        contactedPercentage: calculatePercentage(totalContactedGuarantees, totalGuarantees),
        confirmedPercentage: calculatePercentage(totalConfirmedGuarantees, totalGuarantees),
        attendedPercentage: calculatePercentage(totalAttendees, totalGuarantees)
    };
};

// Function to aggregate guarantors
// Used in OverViewGuarantees to create a table for Guarantees Follow up
export function aggregateGuarantors(guarantees, members) {
    const memberMap = members.reduce((map, member) => {
        map[member.id] = member.name;
        return map;
    }, {});

    return guarantees.reduce((acc, curr) => {
        const guarantorName = memberMap[curr.member] || 'Unknown';
        if (!(curr.member in acc)) {
            acc[curr.member] = {
                name: guarantorName,
                id: curr.member,
                total: 0,
                status: {
                    new: 0,
                    contacted: 0,
                    confirmed: 0,
                    notConfirmed: 0,
                },
                attended: 0,
            };
        }

        acc[curr.member].total += 1;
        if (curr.status === STATUS_MAP.New) acc[curr.member].status.new += 1;
        if (curr.status === STATUS_MAP.Contacted) acc[curr.member].status.contacted += 1;
        if (curr.status === STATUS_MAP.Confirmed) acc[curr.member].status.confirmed += 1;
        if (curr.status !== STATUS_MAP.Confirmed) acc[curr.member].status.notConfirmed += 1;
        if (curr.attended) acc[curr.member].attended += 1;

        return acc;
    }, {});
}


// Function to get aggregated guarantor data
export function getAggregatedGuarantorData(campaignGuarantees, campaignMembers) {
    const aggregatedGuarantors = aggregateGuarantors(campaignGuarantees, campaignMembers);
    return Object.values(aggregatedGuarantors);
}


// Function to construct status columns
export function constructStatusColumns(campaignGuarantees) {
    return CampaignGuaranteeStatusOptions.map(statusOption => ({
        Header: statusOption.name,
        accessor: (rowData) => {
            const memberId = rowData.id;
            return getStatusCountForMember(campaignGuarantees, memberId, statusOption.value);
        }
    }));
}

// Table: Get background class based on status option
export function getBgClassForStatus(columnIndex) {
    const statusOption = CampaignGuaranteeStatusOptions.find(option => option.id === columnIndex - 2);
    return statusOption ? statusOption.bgClass : '';
}


// Function to get status count for a member
export function getStatusCountForMember(campaignGuarantees, memberId, statusValue) {
    return campaignGuarantees.filter(guarantee =>
        guarantee.member === memberId &&
        guarantee.status === STATUS_MAP[statusValue]
    ).length;
}

// Function to get guarantees counts for a member
// export function getGuaranteesCountsForMember(guarantees, memberId) {
//     return guarantees.filter(guarantee => guarantee.member === memberId).length;
// }

// Function to get attendees counts for a member
// export function getAttendeesCountsForMember(guarantees, memberId) {
//     return guarantees.filter(
//         guarantee => guarantee.member === memberId && guarantee.attended
//     ).length;
// }

