import { useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';

const useElectorDataSource = (viewState) => {
    const { viewSettings = {}, viewDetails } = viewState;


    const { electionStatistics, electorsByFamily, electorsByArea,
        electorsByCommittee, electorsByCategories, electorsByFamilyDivision

        // Family Branch
    } = useSelector(electorSelector);

    const { electorsByFamilyBranch, electorsByFamilyBranchArea, electorsByAreaFamilyBranch } = electorsByFamilyDivision

    const getFamilyData = () => {
        switch (viewDetails?.activeFamilyView) {
            case 'detailedFamilyAreaView':
                return electorsByCategories?.areaFamilyDetailed;
            case 'detailedFamilyDivisionView':
                if (viewSettings.displaySeries === "all") {
                    return electorsByFamilyBranch;
                }
                if (viewSettings.displaySeries === "branches") {
                    return electorsByAreaFamilyBranch;
                }
                if (viewSettings.displaySeries === "branches") {
                    return electorsByAreaFamilyBranch;
                }
                if (viewSettings.displaySeries === "areas") {
                    return electorsByFamilyBranchArea;
                }
                return electorsByFamilyBranch;
            default:
                return electorsByFamily;
        }
    };

    console.log("electorsByFamilyBranch: ", electorsByFamilyBranch)


    return useMemo(() => {
        const colors = viewSettings.display === "gender"
            ? ['var(--vz-info)', 'var(--vz-pink)']
            : ["var(--vz-primary)", "var(--vz-secondary)", "var(--vz-success)", "var(--vz-info)", "var(--vz-warning)", "var(--vz-danger)", "var(--vz-dark)", "var(--vz-primary)", "var(--vz-success)", "var(--vz-secondary)"];

        const familyData = getFamilyData();

        const dataKey = viewSettings.display === "gender" ? 'dataSeriesByGender' : 'dataSeries';

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
    }, [electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee, electorsByCategories, getFamilyData, electorsByFamilyBranch, viewState]);
};

export default useElectorDataSource;
