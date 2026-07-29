const prisma = require("../config/prisma");

async function createExpense(userId, { title, amount, description, date, categoryId }) {
  if (!title || amount === undefined || !date || !categoryId) {
    throw new Error("Title, amount, date and category are required");
  }

  const category = await prisma.category.findFirst({
    where: { id: Number(categoryId), userId },
  });
  if (!category) {
    throw new Error("Invalid category");
  }

  return prisma.expense.create({
    data: {
      title,
      amount: Number(amount),
      description: description || null,
      date: new Date(date),
      userId,
      categoryId: Number(categoryId),
    },
    include: { category: true },
  });
}

async function getExpenses(userId, filters = {}) {
  const { categoryId, month, year, search } = filters;

  const where = { userId };

  if (categoryId) where.categoryId = Number(categoryId);

  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 1);
    where.date = { gte: start, lt: end };
  } else if (year) {
    const start = new Date(Number(year), 0, 1);
    const end = new Date(Number(year) + 1, 0, 1);
    where.date = { gte: start, lt: end };
  }

  if (search) {
    where.title = { contains: search };
  }

  return prisma.expense.findMany({
    where,
    include: { category: true },
    orderBy: { date: "desc" },
  });
}

async function getExpenseById(id, userId) {
  const expense = await prisma.expense.findFirst({
    where: { id: Number(id), userId },
    include: { category: true },
  });
  if (!expense) throw new Error("Expense not found");
  return expense;
}

async function updateExpense(id, userId, { title, amount, description, date, categoryId }) {
  const expense = await prisma.expense.findFirst({
    where: { id: Number(id), userId },
  });
  if (!expense) throw new Error("Expense not found");

  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: Number(categoryId), userId },
    });
    if (!category) throw new Error("Invalid category");
  }

  return prisma.expense.update({
    where: { id: Number(id) },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(amount !== undefined ? { amount: Number(amount) } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(date !== undefined ? { date: new Date(date) } : {}),
      ...(categoryId !== undefined ? { categoryId: Number(categoryId) } : {}),
    },
    include: { category: true },
  });
}

async function deleteExpense(id, userId) {
  const expense = await prisma.expense.findFirst({
    where: { id: Number(id), userId },
  });
  if (!expense) throw new Error("Expense not found");

  return prisma.expense.delete({ where: { id: Number(id) } });
}

async function getSummary(userId, { month, year } = {}) {
  const now = new Date();
  const m = month ? Number(month) : now.getMonth() + 1;
  const y = year ? Number(year) : now.getFullYear();

  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);

  const expenses = await prisma.expense.findMany({
    where: { userId, date: { gte: start, lt: end } },
    include: { category: true },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = {};
  for (const e of expenses) {
    const key = e.category.id;
    if (!byCategory[key]) {
      byCategory[key] = {
        categoryId: e.category.id,
        name: e.category.name,
        color: e.category.color,
        icon: e.category.icon,
        total: 0,
        count: 0,
      };
    }
    byCategory[key].total += e.amount;
    byCategory[key].count += 1;
  }

  const budget = await prisma.budget.findFirst({
    where: { userId, month: m, year: y },
  });

  return {
    month: m,
    year: y,
    total,
    count: expenses.length,
    byCategory: Object.values(byCategory).sort((a, b) => b.total - a.total),
    budget: budget ? budget.amount : null,
    remaining: budget ? budget.amount - total : null,
  };
}

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getSummary,
};
