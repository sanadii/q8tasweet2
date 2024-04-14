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
                filterByCommittee(item)
            );
        });
    }, [data, filterByCategory, globalSearchFilter, filterByGender, filterByStatus, filterByPriority, filterByRole, filterByMember, filterByCommittee]);

    return { filteredData, filters, setFilters };
};

export { useFilter };
