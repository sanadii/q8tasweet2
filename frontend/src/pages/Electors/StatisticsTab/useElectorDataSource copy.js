import { useMemo, useCallback } from 'react';
import { useSelector } from "react-redux";
import { electorSelector } from 'selectors';

const useElectorDataSource = (viewState) => {
    const { viewSettings } = viewState;
    const {
        displayByGender, displayAllElectors, familyBranchOption, areaCommitteeOption, reverseView
    } = viewSettings;

    const { electorsByAll, electorsByCategory } = useSelector(electorSelector);

    const {
        electorsByAllFamilies, electorsByAllBranches, electorsByAllAreas, electorsByAllCommittees,
        electorsByAllFamilyAreas, electorsByAllFamilyCommittees, electorsByAllBranchAreas, electorsByAllBranchCommittees,
    } = electorsByAll


    const {
        electorsByFamily, electorsByBranch, electorsByArea, electorsByCommittee,
        electorsByFamilyArea, electorsByFamilyCommittee, electorsByBranchArea, electorsByBranchCommittee,
    } = electorsByCategory
    
    const getElectorsData = useCallback(() => {
        const baseOptions = {
      
        };

        const familyBranchOptions = {
            "": {
                "": displayAllElectors ? electorsByAll.electorsByAllFamilies : electorsByCategory.electorsByFamily,
                "area": displayAllElectors ? electorsByAll.electorsByAllAreas : electorsByCategory.electorsByArea,
                "committee": displayAllElectors ? electorsByAll.electorsByAllCommittees : electorsByCategory.electorsByCommittee,
            },
            "family": {
                "": displayAllElectors ? electorsByAll.electorsByAllFamilies : electorsByCategory.electorsByFamily,
                "area": displayAllElectors ? electorsByAll.electorsByAllFamilyAreas : electorsByCategory.electorsByFamilyArea,
                "committee": displayAllElectors ? electorsByAll.electorsByAllFamilyCommittees : electorsByCategory.electorsByFamilyCommittee,
            },
            "branch": {
                "": displayAllElectors ? electorsByAll.electorsByAllFamilies : electorsByCategory.electorsByFamily,
                "area": displayAllElectors ? electorsByAll.electorsByAllBranchAreas : electorsByCategory.electorsByBranchArea,
                "committee": displayAllElectors ? electorsByAll.electorsByAllBranchCommittees : electorsByCategory.electorsByBranchCommittee,
            }
        };

        let result = familyBranchOptions[familyBranchOption][areaCommitteeOption] || [];
        return reverseView ? result?.reverse : result;
    }, [displayAllElectors, familyBranchOption, areaCommitteeOption, reverseView, electorsByAll, electorsByCategory]);

    return useMemo(() => {
        const colors = displayByGender
            ? ['var(--vz-info)', 'var(--vz-pink)']
            : ["var(--vz-primary)", "var(--vz-secondary)", "var(--vz-success)", "var(--vz-info)", "var(--vz-warning)", "var(--vz-danger)", "var(--vz-dark)"];

        const electorData = getElectorsData();

        const dataKey = displayByGender ? 'dataSeriesByGender' : 'dataSeries';

        const commonOptions = {
            colors,
        };

        return {
            electorsByFamily: {
                ...commonOptions,
                label: 'العوائل والقبائل',
                categories: electorData.categories || [],
                series: electorData[dataKey] || [],
            },
            electorsByArea: {
                ...commonOptions,
                label: 'المناطق السكنية',
                categories: electorData.categories || [],
                series: electorData[dataKey] || [],
            },
            electorsByCommittee: {
                ...commonOptions,
                label: 'اللجان الإنتخابية',
                categories: electorData.categories || [],
                series: electorData[dataKey] || [],
            }
        };
    }, [displayByGender, getElectorsData]);
};

export default useElectorDataSource;
