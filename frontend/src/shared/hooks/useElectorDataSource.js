// hooks/useElectorDataSource.js
import { useMemo } from 'react';

const useElectorDataSource = (electionStatistics, electorsByFamily, electorsByArea, electorsByCommittee, options) => {
    const { selected, detailedChart } = options; // Destructure for easier access

    const selectedResultBygender = selected?.resultByGender
    const detailedFamilyChart = detailedChart?.familyChart

    return useMemo(() => {
        const commonOptions = {
            statistics: electionStatistics,
            colors: selectedResultBygender ? ['var(--vz-info)', 'var(--vz-pink)'] : ['var(--vz-success)'],
        };

        return {
            electorsByFamily: {
                ...commonOptions,
                label: 'العائلة - القبيلة',
                categories: detailedFamilyChart ? electorsByFamily?.categories : [],
                series: detailedFamilyChart ? electorsByFamily?.dataSeriesByGender : electorsByFamily?.dataSeries,
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

export { useElectorDataSource };
