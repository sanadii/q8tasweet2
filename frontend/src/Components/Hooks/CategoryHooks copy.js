import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { ElectionCategoryOptions } from "../common/data/dataKuwait";
import { getCategories } from "../../store/actions";

export const ElectionCategoryFilter = () => {
  const dispatch = useDispatch();

  const { categories, subCategories } = useSelector((state) => ({
    categories: state.Categories.categories,
    subCategories: state.Categories.subCategories,
  }));
  // const [categories, setCategories] = useState([]);
  // const [subCategories, setSubCategories] = useState([]);

  // useEffect(() => {
  //   dispatch(getCategories());
  // }, [dispatch]);

  // const [categoryList, setCategoryList] = useState(ElectionCategoryOptions); // Initial state
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [activeParentCategoryId, setActiveParentCategoryId] = useState(null);

  // const changeCategorieStatus = (e) => {
  //   const activeCategoryId = e.target.value;
  //   const selectedCategory = categoryList.find(
  //     (category) => category.id === Number(activeCategoryId)
  //   );

  //   setActiveParentCategoryId(Number(activeCategoryId));
  //   setSubCategoryList(selectedCategory ? selectedCategory.subCategory : []);
  // };

  return {
    // changeCategorieStatus,
    // // categoryList, // Export categoryList
    // subCategoryList,
    // activeParentCategoryId,
  };
};
