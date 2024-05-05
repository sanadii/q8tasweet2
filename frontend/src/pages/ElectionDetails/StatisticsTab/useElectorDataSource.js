import { useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';

const useElectorDataSource = (viewState) => {
    const { viewSettings, viewDetails } = viewState;
    const {
        resultsToShow, displayByGender, displayByOption, displayWithOption,
        displayAllElectors, displayAllOption, familyBranchOption, areaCommitteeOption, swapView
    } = viewSettings

    console.log("whhat is the viewSettings?",
        "familyBranchOption: ", familyBranchOption,
        "areaCommitteeOption: ", areaCommitteeOption,
        "displayAllElectors: ", displayAllElectors,)

    const { electionStatistics, electorsByFamily, electorsByArea,
        electorsByCommittee, electorsByCategories, electorsByCategory
    } = useSelector(electorSelector);



    const { electorsByFamilyAllBranches, electorsByFamilyAllAreas, electorsByFamilyAllCommittees,
        electorsByFamilyBranch, electorsByFamilyArea, electorsByFamilyCommittee,
        electorsByFamilyBranchArea, electorsByFamilyAreaBranch,
        electorsByFamilyBranchCommittee, electorsByFamilyCommitteeBranch
    } = electorsByCategory


    const getFamilyData = () => {
        // const { swapView, familyBranchOption, areaCommitteeOption } = viewDetails;


        // store action: getElectorStats
        if (displayAllElectors) {
            // Handle combinations of familyBranchOption and areaCommitteeOption
            if (familyBranchOption === "") {
                if (areaCommitteeOption === "") {
                    return electorsByFamilyAllBranches;
                }
                if (areaCommitteeOption === "area") {
                    return electorsByFamilyAllAreas;
                }
                if (areaCommitteeOption === "committee") {
                    return electorsByFamilyAllCommittees;
                }

            }
            if (familyBranchOption === "family") {
                if (areaCommitteeOption === "") {
                    return electorsByFamilyAllBranches;
                }
                if (areaCommitteeOption === "area") {
                    return electorsByFamilyAllAreas;
                }
                if (areaCommitteeOption === "committee") {
                    return electorsByFamilyAllCommittees;
                }
            }
            if (familyBranchOption === "branch") {
                if (areaCommitteeOption === "") {
                    return electorsByFamilyAllBranches;
                }
                if (areaCommitteeOption === "committee") {
                    return swapView ? electorsByFamilyBranchCommittee : electorsByFamilyCommitteeBranch;
                }
                if (areaCommitteeOption === "area") {
                    return swapView ? electorsByFamilyBranchArea : electorsByFamilyAreaBranch;
                }
            }


            // switch (familyBranchOption) {
            //     case "":
            //         console.log("Displaying all areas");
            //         return electorsByFamilyAllAreas;
            //     case "area":
            //         console.log("Displaying all areas");
            //         return electorsByFamilyAllAreas;
            //     case "committee":
            //         console.log("Displaying all committees");
            //         return electorsByFamilyAllCommittees;
            //     default:
            //         console.log("No specific view option selected. Defaulting to branches.");
            //         return electorsByFamilyAllBranches;  // Return all branches by default if nothing matches
            // }

            // store action: getElectorStatsByCategory
        } else {
            // Handle combinations of familyBranchOption and areaCommitteeOption
            if (familyBranchOption === "") {
                if (areaCommitteeOption === "") {
                    return electorsByFamily;
                }
                if (areaCommitteeOption === "area") {
                    return electorsByFamilyArea;
                }
                if (areaCommitteeOption === "committee") {
                    return electorsByFamilyCommittee;
                }

            }
            if (familyBranchOption === "family") {
                if (areaCommitteeOption === "") {
                    return electorsByFamily;
                }
                if (areaCommitteeOption === "area") {
                    return electorsByFamilyArea;
                }
                if (areaCommitteeOption === "committee") {
                    return electorsByFamilyCommittee;
                }
            }
            if (familyBranchOption === "branch") {
                if (areaCommitteeOption === "") {
                    return electorsByFamilyBranch;
                }

                if (areaCommitteeOption === "area") {
                    return swapView ? electorsByFamilyBranchArea : electorsByFamilyAreaBranch;
                }
                if (areaCommitteeOption === "committee") {
                    return swapView ? electorsByFamilyBranchCommittee : electorsByFamilyCommitteeBranch;
                }
            }
        }


        //         // Check for combinations with more elements first
        //         if (familyBranchOption === "branch" && areaCommitteeOption === "committee") {
        //             console.log("calling electorsByFamilyCommitteeBranch: ")

        //             return swapView ? electorsByFamilyCommitteeBranch : electorsByFamilyBranchCommittee;

        //         }

        //         if (familyBranchOption === "branch" && areaCommitteeOption === "area") {
        //             return swapView ? electorsByFamilyAreaBranch : electorsByFamilyBranchArea;
        //         }

        //         // Then check for single elements
        //         if (familyBranchOption === "committee") {
        //             console.log("Returning data for committees");
        //             return electorsByFamilyCommittee;
        //         }
        //         if (familyBranchOption === "area") {
        //             console.log("Returning data for areas");
        //             return electorsByFamilyArea;
        //         }
        //         if (familyBranchOption === "branch") {
        //             console.log("Returning data for branches");
        //             return electorsByFamilyBranch;
        //         }

        //         // Default case when no specific option matches
        //         switch (areaCommitteeOption) {
        //             case "branches":
        //                 return electorsByFamilyAllBranches;
        //             case "areas":
        //                 return electorsByFamilyAllAreas;
        //             case "committees":
        //                 return electorsByFamilyAllCommittees;
        //             default:
        //                 console.log("Default case: no specific view option selected.");
        //                 return electorsByFamilyAllBranches;  // Return all branches by default if nothing matches
        //         }
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
