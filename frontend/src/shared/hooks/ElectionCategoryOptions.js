//Component/Hooks/ElectionCategoryOptions.js

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useCategoryOptions = () => {
  const { categories, subCategories } = useSelector(state => ({
    categories: state.Category.categories,
    subCategories: state.Category.subCategories
  }));

  // Convert categories and subCategories into options format
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [activeParentCategoryId, setActiveParentCategoryId] = useState(null);

  useEffect(() => {
    setCategoryOptions(categories.map(cat => ({ value: cat.id, label: cat.name })));
  }, [categories]);

  const changeCategorieStatus = (e) => {
    const activeCategoryId = Number(e.target.value);
    setActiveParentCategoryId(activeCategoryId);

    // Filtering subcategories based on the selected parent category
    const relatedSubCategories = subCategories.filter(
      subCategory => subCategory.parentId === activeCategoryId
    );
    setSubCategoryOptions(relatedSubCategories.map(sub => ({ value: sub.id, label: sub.name })));
  };

  return {
    changeCategorieStatus,
    categoryOptions,
    subCategoryOptions,
    activeParentCategoryId
  };
};
