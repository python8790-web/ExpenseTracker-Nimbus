import api from "./axios";
import type { Category } from "../types";

export async function listCategories() {
  const { data } = await api.get<Category[]>("/categories");
  return data;
}

export async function createCategory(payload: { name: string; color: string; icon: string }) {
  const { data } = await api.post<Category>("/categories", payload);
  return data;
}

export async function updateCategory(
  id: number,
  payload: { name: string; color: string; icon: string }
) {
  const { data } = await api.put<Category>(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: number) {
  const { data } = await api.delete<{ message: string }>(`/categories/${id}`);
  return data;
}
