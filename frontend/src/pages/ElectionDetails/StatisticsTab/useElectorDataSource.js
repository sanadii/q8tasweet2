import { useMemo } from 'react';

const useElectorDataSource = (
    electionStatistics,
    electorsByFamily,
    electorsByArea,
    electorsByCommittee,
    electorsByCategories,

    // Family
    electorsByBranchFamily, 
    electorsByFamilyBranches,
    
    viewState,
) => {
    const { displaySettings = {}, viewDetails } = viewState;

    const getFamilyData = () => {
        switch (viewDetails?.activeFamilyView) {
            case 'detailedFamilyAreaView':
                return electorsByCategories?.areaFamilyDetailed;
            case 'detailedFamilyDivisionView':
                return electorsByFamilyBranches;
            default:
                return electorsByFamily;
        }
    };


    console.log("electorsByFamilyBranches: ", electorsByFamilyBranches)

    
    return useMemo(() => {
        const colors = displaySettings.filterByGender
            ? ['var(--vz-info)', 'var(--vz-pink)']
            : ["var(--vz-primary)", "var(--vz-secondary)", "var(--vz-success)", "var(--vz-info)", "var(--vz-warning)", "var(--vz-danger)", "var(--vz-dark)", "var(--vz-primary)", "var(--vz-success)", "var(--vz-secondary)"];

        const familyData = getFamilyData();

        const dataKey = displaySettings.filterByGender ? 'dataSeriesByGender' : 'dataSeries';

        const commonOptions = {
            statistics: electionStatistics,
            colors,
        };

        return {
            electorsByFamily: {
                ...commonOptions,
                label: 'العوائل والقبائل',
                categories: familyData?.categories || [],
                series: familyData?.[dataKey] || [],
            },
            electorsByArea: {
                ...commonOptions,
                label: 'المناطق السكنية',
                categories: electorsByArea?.categories || [],
                series: electorsByArea?.[dataKey] || [],
            },
            electorsByCommittee: {
                ...commonOptions,
                label: 'اللجان الإنتخابية',
                categories: electorsByCommittee?.categories || [],
                series: electorsByCommittee?.[dataKey] || [],
            }
        };
    }, [electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee, electorsByCategories, electorsByFamilyBranches, viewState]);
};

export default useElectorDataSource;
