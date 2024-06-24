import { createSelector } from 'reselect';

const selectCategoriesState = state => state.Categories;

export const categorySelector = createSelector(
  selectCategoriesState,
  categoriesState => ({
    categories: categoriesState.categories || [],
    subCategories: categoriesState.subCategories || [],
  })
);
