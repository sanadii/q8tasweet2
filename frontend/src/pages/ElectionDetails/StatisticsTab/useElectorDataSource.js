import { useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';

const useElectorDataSource = (viewState) => {
    const { viewSettings = {}, viewDetails } = viewState;
    const { resultsToShow, displayByGender, displayByOption, displayWithoutOption, displayWithOption } = viewSettings

    const { electionStatistics, electorsByFamily, electorsByArea,
        electorsByCommittee, electorsByCategories, electorsByFamilyDivision
    } = useSelector(electorSelector);

    const { electorsByFamilyAllBranches, electorsByFamilyAllAreas, electorsByFamilyAllCommittees,
        electorsByFamilyBranch, electorsByFamilyArea, electorsByFamilyCommittee,
        electorsByFamilyBranchArea, electorsByFamilyBranchCommitee, electorsByAreaFamilyBranch,
    } = electorsByFamilyDivision


    // need to add the flipping part
    const displayMapping = useMemo(() => ({
        branches: displayByOption ? electorsByFamilyBranch : electorsByFamilyAllBranches,
        areas: displayByOption ? electorsByFamilyArea : electorsByFamilyAllAreas,
        committees: displayByOption ? electorsByFamilyCommittee : electorsByFamilyAllCommittees,
        branches_areas: displayByOption ? electorsByAreaFamilyBranch : null,
        branches_committees: displayByOption ? electorsByFamilyBranchCommitee : null,
    }), [displayByOption, electorsByFamilyDivision]);

    const getFamilyData = () => {
        switch (viewDetails?.activeFamilyView) {
            case 'detailedFamilyAreaView':
                return electorsByFamilyDivision?.areaFamilyDetailed;
            case 'detailedFamilyDivisionView':
                if (displayByOption) {
                    return displayWithOption.reduce((acc, option) => displayMapping[option] || acc, null);
                } else {
                    return displayMapping[displayWithoutOption] || electorsByFamilyBranch;
                }
            default:
                return electorsByFamilyAllBranches;
        }
    };




    return useMemo(() => {
        const colors = viewSettings.displayByGender === true
            ? ['var(--vz-info)', 'var(--vz-pink)']
            : ["var(--vz-primary)", "var(--vz-secondary)", "var(--vz-success)", "var(--vz-info)", "var(--vz-warning)", "var(--vz-danger)", "var(--vz-dark)", "var(--vz-primary)", "var(--vz-success)", "var(--vz-secondary)"];

        const familyData = getFamilyData();

        const dataKey = viewSettings.displayByGender === true ? 'dataSeriesByGender' : 'dataSeries';

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
