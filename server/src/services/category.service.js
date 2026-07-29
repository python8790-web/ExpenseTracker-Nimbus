const prisma = require("../config/prisma");

async function createCategory(name, color, icon, userId) {
  return prisma.category.create({
    data: { name, color, icon, userId },
  });
}

async function getCategories(userId) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function updateCategory(id, name, color, icon, userId) {
  const category = await prisma.category.findFirst({
    where: { id: Number(id), userId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: { id: Number(id) },
    data: { name, color, icon },
  });
}

async function deleteCategory(id, userId) {
  const category = await prisma.category.findFirst({
    where: { id: Number(id), userId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.delete({ where: { id: Number(id) } });
}

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
