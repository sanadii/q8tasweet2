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
<<<<<<< HEAD
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
=======

        // Guarantee
        guaranteeStatus: null,
    });

    const globalSearchFilter = useCallback(({ name, fullName, civil }) => {
        const { global } = filters;
        if (!global) return true;
        const globalSearch = global.toLowerCase();
        return (
            (name && name.toLowerCase().includes(globalSearch)) ||
            (fullName && fullName.toLowerCase().includes(globalSearch)) ||
            (civil && String(civil).includes(globalSearch))
        );
    }, [filters]);

    const filterByCategory = useCallback(({ category }) => {
        const { category: selectedCategory } = filters;
        return selectedCategory === null || category === selectedCategory;
    }, [filters]);

    const filterByGender = useCallback(({ gender }) => {
        const { gender: selectedGender } = filters;
        return selectedGender === null || gender === selectedGender;
    }, [filters]);

    const filterByStatus = useCallback(({ task }) => {
        const { status } = filters;
        return status === null || task.status === status;
    }, [filters]);

    const filterByPriority = useCallback(({ task }) => {
        const { priority } = filters;
        return priority === null || task.priority === priority;
    }, [filters]);

    const filterByRole = useCallback(({ role }) => {
        const { role: selectedRole } = filters;
        if (selectedRole === null) return true;
        return Array.isArray(selectedRole)
            ? selectedRole.includes(role)
            : role === selectedRole;
    }, [filters]);

    const filterByMember = useCallback(({ member }) => {
        const { member: selectedMember } = filters;
        return selectedMember === null || member === selectedMember;
    }, [filters]);

    const filterByCommittee = useCallback(({ committee }) => {
        const { committee: selectedCommittee } = filters;
        return selectedCommittee === null || committee === selectedCommittee;
    }, [filters]);


    // Guarantees
    const filterByGuaranteeStatus = useCallback(({ status }) => {
        const { guaranteeStatus: selectedStatus } = filters;
        return selectedStatus === null || status === selectedStatus;
    }, [filters]);


    
    const filteredData = useMemo(() => {
        return data.filter(item => {
            return (
                filterByCategory(item) &&
                globalSearchFilter(item) &&
                filterByGender(item) &&
                filterByStatus(item) &&
                filterByPriority(item) &&
                filterByRole(item) &&
                filterByMember(item) &&
                filterByCommittee(item) &&
                filterByGuaranteeStatus(item)
            );
        });
    }, [data, filterByCategory, globalSearchFilter, filterByGender, filterByStatus, filterByPriority, filterByRole, filterByMember, filterByCommittee]);
>>>>>>> sanad

    return { filteredData, filters, setFilters };
};

export { useFilter };
