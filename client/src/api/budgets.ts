import api from "./axios";
import type { Budget } from "../types";

export async function listBudgets() {
  const { data } = await api.get<Budget[]>("/budgets");
  return data;
}

export async function setBudget(month: number, year: number, amount: number) {
  const { data } = await api.post<Budget>("/budgets", { month, year, amount });
  return data;
}

export async function deleteBudget(id: number) {
  const { data } = await api.delete<{ message: string }>(`/budgets/${id}`);
  return data;
}
