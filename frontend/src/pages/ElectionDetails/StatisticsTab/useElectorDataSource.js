import { useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';

const useElectorDataSource = (viewState) => {
    const { viewSettings = {}, viewDetails } = viewState;
    const { resultsToShow, displayByGender, displayByOption, displayWithoutOption, displayWithOption, swapView } = viewSettings

    const { electionStatistics, electorsByFamily, electorsByArea,
        electorsByCommittee, electorsByCategories, electorsByFamilyDivision
    } = useSelector(electorSelector);

    const { electorsByFamilyAllBranches, electorsByFamilyAllAreas, electorsByFamilyAllCommittees,
        electorsByFamilyBranch, electorsByFamilyArea, electorsByFamilyCommittee,
        electorsByFamilyBranchArea, electorsByFamilyAreaBranch,
        electorsByFamilyBranchCommittee, electorsByFamilyCommitteeBranch
    } = electorsByFamilyDivision

    const getFamilyData = () => {
        const { activeFamilyView } = viewDetails;
        switch (activeFamilyView) {
            case 'detailedFamilyAreaView':
                return electorsByCategories?.areaFamilyDetailed;

            case 'detailedFamilyDivisionView':
                if (displayByOption) {
                    const hasAllOptions = (options) => options.every(option => displayWithOption.includes(option));
                    console.log("WHAT?:  display Option: ", displayByOption, "displayWithOption: ", displayWithOption, "hasAllOptions: ", hasAllOptions);

                    // Check for combinations with more elements first
                    if (hasAllOptions(["branches", "committees"])) {
                        if (swapView) {
                            return electorsByFamilyCommitteeBranch;
                        } else
                            return electorsByFamilyBranchCommittee;
                    }


                    if (hasAllOptions(["branches", "areas"])) {
                        if (swapView) {
                            return electorsByFamilyAreaBranch;
                        } else
                            return electorsByFamilyBranchArea;
                    }

                    // Then check for single elements
                    if (hasAllOptions(["committees"])) {
                        console.log("WHAT?: electorsByFamilyCommittee");
                        return electorsByFamilyCommittee;
                    }
                    if (hasAllOptions(["areas"])) {
                        console.log("WHAT?: electorsByFamilyArea");
                        return electorsByFamilyArea;
                    }
                    if (hasAllOptions(["branches"])) {
                        console.log("WHAT?: electorsByFamilyBranch");
                        return electorsByFamilyBranch;
                    }
                } else {
                    return {
                        "branches": electorsByFamilyAllBranches,
                        "areas": electorsByFamilyAllAreas,
                        "committees": electorsByFamilyAllCommittees
                    }[displayWithoutOption];
                }
                break;

            default:
                return electorsByFamilyAllBranches;
        }
    };







    return useMemo(() => {
        const colors = viewSettings.displayByGender === true
            ? ['var(--vz-info)', 'var(--vz-pink)']
            : ["var(--vz-primary)", "var(--vz-secondary)", "var(--vz-success)", "var(--vz-info)", "var(--vz-warning)", "var(--vz-danger)", "var(--vz-dark)", "var(--vz-primary)", "var(--vz-success)", "var(--vz-secondary)"];

        const familyData = getFamilyData();

        console.log("familyData: ", familyData)
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
