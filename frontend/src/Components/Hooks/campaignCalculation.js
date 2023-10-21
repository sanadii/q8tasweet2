// campaignCalculation.js
import { GuaranteeStatusOptions, STATUS_MAP } from "Components/constants";

export const calculateCampaignData = (campaignDetails, campaignGuarantees) => {
    
    // const targetVotes = campaignDetails.targetVotes;
    // const targeetGuarantees = targetVotes/campaignGuarantees.length;
    // const targeetConfirmed = targetVotes/targeetConfirmed.length;
    // const targeetAttended = targetVotes/targeetAttended.length;
    


    const statusCounts = {};
    const attendeesStatusCounts = {};
    GuaranteeStatusOptions.forEach(option => {
        statusCounts[option.value] = 0;
        attendeesStatusCounts[option.value] = 0;
    });

    let totalGuarantees = campaignGuarantees.length;
    let totalAttendees = 0;
    let contactedGuarantees = 0;
    let confirmedGuarantees = 0;

    campaignGuarantees.forEach(guarantee => {
        const statusOption = GuaranteeStatusOptions.find(option => option.id === guarantee.status);
        if (statusOption) {
            statusCounts[statusOption.value]++;
            if (guarantee.attended) {
                totalAttendees++;
                attendeesStatusCounts[statusOption.value]++;
            }
        }
        if (guarantee.status === STATUS_MAP.Contacted || guarantee.status === STATUS_MAP.Confirmed) {
            contactedGuarantees++;
        }
        if (guarantee.status === STATUS_MAP.Contacted) {
            confirmedGuarantees++;
        }
    });

    const calculatePercentage = (count) => {
        const percentage = (count / totalGuarantees) * 100;
        if (isNaN(percentage)) {
            console.error("Percentage calculations failed for count:", count);
            return 0;
        }
        return parseFloat(percentage.toFixed(1));
    };

    const statusPercentages = {};
    const attendeesStatusPercentages = {};

    Object.keys(statusCounts).forEach(status => {
        statusPercentages[status] = calculatePercentage(statusCounts[status]);
        attendeesStatusPercentages[status] = calculatePercentage(attendeesStatusCounts[status]);
    });

    return {
        statusCounts,
        totalGuarantees,
        totalAttendees,
        attendeesStatusCounts,
        statusPercentages,
        attendeesStatusPercentages,
        contactedPercentage: calculatePercentage(contactedGuarantees),
        confirmedPercentage: calculatePercentage(confirmedGuarantees),
        attendedPercentage: calculatePercentage(totalAttendees)
    };
}

// Construct table with Guarantors
export function aggregateGuarantors(guarantees, members) {
    const memberMap = members.reduce((map, member) => {
        map[member.id] = member.fullName;
        return map;
    }, {});

    return guarantees.reduce((acc, curr) => {
        const guarantorName = memberMap[curr.member] || 'Unknown';
        if (curr.member in acc) {
            acc[curr.member].count += 1;
        } else {
            acc[curr.member] = {
                name: guarantorName,
                count: 1,
                member: curr.member,
            };
        }
        return acc;
    }, {});
}


export function getAggregatedGuarantorData(campaignGuarantees, campaignMembers) {
    const aggregatedGuarantors = aggregateGuarantors(campaignGuarantees, campaignMembers);
    return Object.values(aggregatedGuarantors);
}

// For table calculations
export function getGuaranteesCountsForMember(guarantees, memberId) {
    return guarantees.filter(guarantee => guarantee.member === memberId).length;
}

export function getAttendeesCountsForMember(guarantees, memberId) {
    return guarantees.filter(
        guarantee => guarantee.member === memberId && guarantee.attended
    ).length;
}

export function getStatusCountForMember(campaignGuarantees, memberId, statusValue) {
    return campaignGuarantees.filter(guarantee =>
        guarantee.member === memberId &&
        guarantee.status === STATUS_MAP[statusValue]
    ).length;
}

export function constructStatusColumns(campaignGuarantees) {
    return GuaranteeStatusOptions.map(statusOption => ({
        Header: statusOption.name,
        accessor: (rowData) => {
            const memberId = rowData.member;
            return getStatusCountForMember(campaignGuarantees, memberId, statusOption.value);
        }
    }));
}




