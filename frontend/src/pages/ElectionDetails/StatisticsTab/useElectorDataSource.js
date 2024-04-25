// hooks/useElectorDataSource.js
import { useMemo } from 'react';

const useElectorDataSource = (electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee, electorsByCategories, options) => {
    const { selected, detailedChart } = options; // Destructure for easier access

    const selectedResultBygender = selected?.resultByGender
    const detailedFamilyChart = detailedChart?.familyChart


    const electorsByFamilyDetailed = electorsByCategories?.familyAreaDetailed

    // console.log("detailedFamilyChart:", detailedFamilyChart)
    // console.log("detailedFamilyChart electorsByFamilyDetailed:", electorsByFamilyDetailed)


    return useMemo(() => {
        const commonOptions = {
            statistics: electionStatistics,
            colors: selectedResultBygender ?
                ['var(--vz-info)', 'var(--vz-pink)']
                :
                ["var(--vz-primary)", "var(--vz-secondary)", "var(--vz-success)", "var(--vz-info)", "var(--vz-warning)", "var(--vz-danger)", "var(--vz-dark)", "var(--vz-primary)", "var(--vz-success)", "var(--vz-secondary)"],
        };

        return {
            electorsByFamily: {
                ...commonOptions,
                label: 'العوائل والقبائل',
                categories: detailedFamilyChart ? (electorsByFamilyDetailed?.categories || []) : electorsByFamily?.categories,
                series: detailedFamilyChart ? (electorsByFamilyDetailed?.dataSeries || []) : electorsByFamily?.dataSeries,
            },
            electorsByArea: {
                ...commonOptions,
                label: 'المناطق السكنية',
                categories: electorsByArea?.categories || [],
                series: selectedResultBygender ? electorsByArea?.dataSeriesByGender : electorsByArea?.dataSeries,
            },
            electorsByCommittee: {
                ...commonOptions,
                label: 'اللجان الإنتخابية',
                categories: electorsByCommittee?.categories || [],
                series: selectedResultBygender ? electorsByCommittee?.dataSeriesByGender : electorsByCommittee?.dataSeries,
            }
        };
    }, [electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee, selected, detailedChart]);
};

export default useElectorDataSource;
