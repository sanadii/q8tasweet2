import { useState } from "react";
import { ElectionCategoryOptions } from "../../common/data/kuwaitData";

export const ElectionCategoryFilter = () => {
  const [categoryList, setCategoryList] = useState(ElectionCategoryOptions); // Initial state
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [activeParentCategoryId, setActiveParentCategoryId] = useState(null);

  const changeCategorieStatus = (e) => {
    const activeCategoryId = e.target.value;
    const selectedCategory = categoryList.find(
      (category) => category.id === Number(activeCategoryId)
    );

    setActiveParentCategoryId(Number(activeCategoryId));
    setSubCategoryList(selectedCategory ? selectedCategory.subCategory : []);
  };

  return {
    changeCategorieStatus,
    categoryList, // Export categoryList
    subCategoryList,
    activeParentCategoryId,
  };
};
