// campaignCalculation.js

export function getGuaranteeCount(guarantees, memberId) {
    return guarantees.filter(guarantee => guarantee.member === memberId).length;
}


export function getStatusCountForMember(guarantees, memberId, status) {
    return guarantees.filter(
        guarantee => guarantee.member === memberId && guarantee.status === status
    ).length;
}


export function getAttendeesCountsForMember(guarantees, memberId) {
    return guarantees.filter(
        guarantee => guarantee.member === memberId && guarantee.attended
    ).length;
}


export function getAllStatusCount(guarantees, status) {
    return guarantees.filter(guarantee => guarantee.status === status).length;
}


export function getAllAttendeesCount(guarantees) {
    return guarantees.filter(guarantee => guarantee.attended).length;
}


export function aggregateGuarantors(guarantees, members) {
    return guarantees.reduce((acc, curr) => {
        const memberInfo = members.find(member => member.id === curr.member);
        const guarantorName = memberInfo ? memberInfo.fullName : 'Unknown';
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
