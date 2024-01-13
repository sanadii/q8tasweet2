import { useState, useMemo, useCallback } from 'react';

const useFilter = (data, initialFilters) => {
    const [filters, setFilters] = useState(initialFilters || {
        global: "",
        gender: null,
        status: null,
        priority: null,
        category: null,
        committee: null,
        member: null,
        role: [30, 31, 32, 33],
    });

    const globalSearchFilter = useCallback((item) => {
        if (!filters.global) return true;
        const globalSearch = filters.global.toLowerCase();
        return (item.name && item.name.toLowerCase().includes(globalSearch)) ||
            (item.fullName && item.fullName.toLowerCase().includes(globalSearch)) ||
            (item.civil && String(item.civil).includes(globalSearch));
    }, [filters.global]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            let isValid = true;

            if (filters.category !== null) {
                isValid = isValid && item.category === filters.category;
            }

            isValid = isValid && globalSearchFilter(item);


            // Gender filters
            if (filters.gender !== null) {
                isValid = isValid && item.gender === filters.gender;
            }

            //   Task filters
            if (filters.status !== null) {
                isValid = isValid && item.task.status === filters.status;
            }

            if (filters.priority !== null) {
                isValid = isValid && item.task.priority === filters.priority;
            }

            // Campaigns
            if (item.role) {
                if (filters.role !== null) {
                    if (Array.isArray(filters.role)) {
                        return filters.role.includes(item.role);
                    } else {
                        return item.role === filters.role;
                    }
                }
            }

            if (filters.member !== null) {
                isValid = isValid && item.member === filters.member;
            }

            if (filters.committee !== null) {
                isValid = isValid && item.committee === filters.committee;
            }

            return isValid;
        });
    }, [data, filters, globalSearchFilter]);

    return { filteredData, filters, setFilters };
};

export { useFilter };
