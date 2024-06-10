import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { electorSelector } from 'selectors';

const useElectorDataSource = (viewState) => {
    const { displayByGender, displayAllElectors, familyBranchOption, areaCommitteeOption, reverseView } = viewState.viewSettings;
    const electors = useSelector(electorSelector);

    const getElectorsData = useCallback(() => {
        const familyBranchOptions = {
            "": {
                "": displayAllElectors ? electors?.electorsByAll?.electorsByAllFamilies : electors?.electorsByCategory?.electorsByFamily,
                "area": displayAllElectors ? electors.electorsByAll.electorsByAllAreas : electors.electorsByCategory.electorsByArea,
                "committee": displayAllElectors ? electors.electorsByAll.electorsByAllCommittees : electors.electorsByCategory.electorsByCommittee,
            },
            "family": {
                "": displayAllElectors ? electors.electorsByAll.electorsByAllFamilies : electors.electorsByCategory.electorsByFamily,
                "area": displayAllElectors ? electors.electorsByAll.electorsByAllFamilyAreas : electors.electorsByCategory.electorsByFamilyArea,
                "committee": displayAllElectors ? electors.electorsByAll.electorsByAllFamilyCommittees : electors.electorsByCategory.electorsByFamilyCommittee,
            },
            "branch": {
                "": displayAllElectors ? electors.electorsByAll.electorsByAllBranches : electors.electorsByCategory.electorsByBranch,
                "area": displayAllElectors ? electors.electorsByAll.electorsByAllBranchAreas : electors.electorsByCategory.electorsByBranchArea,
                "committee": displayAllElectors ? electors.electorsByAll.electorsByAllBranchCommittees : electors.electorsByCategory.electorsByBranchCommittee,
            }
        };

        // Safely access nested properties
        let result = (familyBranchOptions[familyBranchOption] || {})[areaCommitteeOption] || [];
        // Ensure result is always an array to prevent runtime errors
        return reverseView ? result.reverse : result;
    }, [displayAllElectors, familyBranchOption, areaCommitteeOption, reverseView, electors]);

    return useMemo(() => {
        const colors = displayByGender ? ['var(--vz-info)', 'var(--vz-pink)'] : ["var(--vz-primary)", "var(--vz-secondary)", "var(--vz-success)", "var(--vz-info)", "var(--vz-warning)", "var(--vz-danger)", "var(--vz-dark)"];
        const electorData = getElectorsData();
        const dataKey = displayByGender ? 'dataSeriesByGender' : 'dataSeries';

        return {
            colors,
            label: 'العوائل والقبائل',
            categories: electorData?.categories || [],
            series: electorData[dataKey] || [],
            counter: electorData?.counter || []
        };
    }, [displayByGender, getElectorsData]);
};

export default useElectorDataSource;
