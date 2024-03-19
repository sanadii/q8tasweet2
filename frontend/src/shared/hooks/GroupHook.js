// useGroupManager.js
import { useState, useEffect } from 'react';
import { groupSelector } from 'selectors';

const useGroupManager = (categories, groups, validation) => {
  const [categoryOptions, setCategoryOptions] = useState(categories);
  const [groupOptions, setGroupOptions] = useState([]);
  const [activeCategoryCategoryId, setActiveCategoryCategoryId] = useState(null);

  useEffect(() => {
    setCategoryOptions(categories);
    setGroupOptions(groups);
  }, [categories, groups]);


  useEffect(() => {
    if (validation && validation.values.category) {
      const initialCategoryId = Number(validation.values.category);
      const relatedGroups = groups.filter(
        group => group.category === initialCategoryId
      );

      // Check if the values are different before setting them
      let updatedGroups = groupOptions;
      let updatedCategoryId = activeCategoryCategoryId;

      if (activeCategoryCategoryId !== initialCategoryId) {
        updatedCategoryId = initialCategoryId;
      }

      if (JSON.stringify(groupOptions) !== JSON.stringify(relatedGroups)) {
        updatedGroups = relatedGroups;
      }

      setActiveCategoryCategoryId(updatedCategoryId);
      setGroupOptions(updatedGroups);
    }
  }, [validation, groups, activeCategoryCategoryId, groupOptions]);

  const changeGroupsOptions = (e) => {
    const activeCategoryId = Number(e.target.value);
    const relatedGroups = groups.filter(
      group => group.category === activeCategoryId
    );

    setActiveCategoryCategoryId(activeCategoryId);
    const currentGroupValue = validation.values.group;
    const isCurrentGroupStillValid = relatedGroups.some(group => group.id === currentGroupValue);

    if (!isCurrentGroupStillValid) {
      validation.setFieldValue("group", relatedGroups[0]?.id || "");
    }

    setGroupOptions(relatedGroups);
  };

  return {
    categoryOptions,
    groupOptions,
    changeGroupsOptions,
    activeCategoryCategoryId
  };
};

export { useGroupManager };
