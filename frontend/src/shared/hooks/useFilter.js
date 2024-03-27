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
        role: null,
    });

    console.log("filters::: ", filters.role)
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

            // Tab Filters
            if (filters.category !== null) {
                isValid = isValid && item.category === filters.category;
            }



            if (filters.global !== null) {
                isValid = isValid && globalSearchFilter(item);
            }

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
            // Campain Member Role
            if (filters.role !== null) {
                if (Array.isArray(filters.role)) {
                    // If filters.role is an array, check if item.role is in the array
                    isValid = isValid && filters.role.includes(item.role);
                } else {
                    // If filters.role is not an array, check for equality
                    isValid = isValid && item.role === filters.role;
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
