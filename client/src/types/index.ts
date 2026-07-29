export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: number;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

export type Expense = {
  id: number;
  title: string;
  amount: number;
  description: string | null;
  date: string;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
};

export type CategorySummary = {
  categoryId: number;
  name: string;
  color: string;
  icon: string;
  total: number;
  count: number;
};

export type Summary = {
  month: number;
  year: number;
  total: number;
  count: number;
  byCategory: CategorySummary[];
  budget: number | null;
  remaining: number | null;
};

export type Budget = {
  id: number;
  month: number;
  year: number;
  amount: number;
};
