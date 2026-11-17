import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/category';

export interface Category {
  id: number;
  name: string;
  type: CATEGORY_TYPE;
  status: CATEGORY_STATUS;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormValues {
  name: string;
  type: CATEGORY_TYPE;
  status: CATEGORY_STATUS;
}

export type CategoryCreateRequest = Pick<CategoryFormValues, 'name' | 'type'>;
export type CategoryUpdateRequest = CategoryFormValues;

export interface CategoryResourceResponse {
  data: Category;
}

export interface CategoryListResponse {
  data: Category[];
}
