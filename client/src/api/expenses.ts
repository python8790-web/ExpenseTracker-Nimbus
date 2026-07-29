import api from "./axios";
import type { Expense, Summary } from "../types";

export type ExpensePayload = {
  title: string;
  amount: number;
  description?: string;
  date: string;
  categoryId: number;
};

export async function listExpenses(filters?: {
  categoryId?: number;
  month?: number;
  year?: number;
  search?: string;
}) {
  const { data } = await api.get<Expense[]>("/expenses", { params: filters });
  return data;
}

export async function createExpense(payload: ExpensePayload) {
  const { data } = await api.post<Expense>("/expenses", payload);
  return data;
}

export async function updateExpense(id: number, payload: Partial<ExpensePayload>) {
  const { data } = await api.put<Expense>(`/expenses/${id}`, payload);
  return data;
}

export async function deleteExpense(id: number) {
  const { data } = await api.delete<{ message: string }>(`/expenses/${id}`);
  return data;
}

export async function getSummary(month?: number, year?: number) {
  const { data } = await api.get<Summary>("/expenses/summary", {
    params: { month, year },
  });
  return data;
}
