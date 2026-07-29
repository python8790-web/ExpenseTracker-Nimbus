const prisma = require("../config/prisma");

async function setBudget(userId, month, year, amount) {
  if (!month || !year || amount === undefined) {
    throw new Error("Month, year and amount are required");
  }

  const existing = await prisma.budget.findFirst({
    where: { userId, month: Number(month), year: Number(year) },
  });

  if (existing) {
    return prisma.budget.update({
      where: { id: existing.id },
      data: { amount: Number(amount) },
    });
  }

  return prisma.budget.create({
    data: {
      userId,
      month: Number(month),
      year: Number(year),
      amount: Number(amount),
    },
  });
}

async function getBudgets(userId) {
  return prisma.budget.findMany({
    where: { userId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
}

async function deleteBudget(id, userId) {
  const budget = await prisma.budget.findFirst({
    where: { id: Number(id), userId },
  });
  if (!budget) throw new Error("Budget not found");

  return prisma.budget.delete({ where: { id: Number(id) } });
}

module.exports = { setBudget, getBudgets, deleteBudget };
