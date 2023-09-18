// useCategoryManager.js
import { useState, useEffect } from 'react';

const useCategoryManager = (categories, subCategories, validation) => {
  const [categoryOptions, setCategoryOptions] = useState(categories);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [activeParentCategoryId, setActiveParentCategoryId] = useState(null);

  useEffect(() => {
    setCategoryOptions(categories);
    setSubCategoryOptions(subCategories);
  }, [categories, subCategories]);

  useEffect(() => {
    if (validation && validation.values.category) {
      const initialCategoryId = Number(validation.values.category);
      const relatedSubCategories = subCategories.filter(
        subCategory => subCategory.parent === initialCategoryId
      );

      // Check if the values are different before setting them
      if (activeParentCategoryId !== initialCategoryId) {
        setActiveParentCategoryId(initialCategoryId);
      }

      if (JSON.stringify(subCategoryOptions) !== JSON.stringify(relatedSubCategories)) {
        setSubCategoryOptions(relatedSubCategories);
      }
    }
  }, [validation, subCategories]);

  const changeSubCategoriesOptions = (e) => {
    const activeCategoryId = Number(e.target.value);
    const relatedSubCategories = subCategories.filter(
      subCategory => subCategory.parent === activeCategoryId
    );

    setActiveParentCategoryId(activeCategoryId);
    const currentSubCategoryValue = validation.values.subCategory;
    const isCurrentSubCategoryStillValid = relatedSubCategories.some(subCategory => subCategory.id === currentSubCategoryValue);

    if (!isCurrentSubCategoryStillValid) {
      validation.setFieldValue("subCategory", relatedSubCategories[0]?.id || "");
    }

    setSubCategoryOptions(relatedSubCategories);
  };

  return {
    categoryOptions,
    subCategoryOptions,
    changeSubCategoriesOptions,
    activeParentCategoryId
  };
};

export default useCategoryManager;
