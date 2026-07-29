const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const SALT_ROUNDS = 10;

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function registerUser(name, email, password) {
  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const defaultCategories = [
    { name: "Food", color: "#f97316", icon: "utensils" },
    { name: "Transport", color: "#3b82f6", icon: "car" },
    { name: "Shopping", color: "#ec4899", icon: "bag" },
    { name: "Bills", color: "#ef4444", icon: "receipt" },
    { name: "Entertainment", color: "#a855f7", icon: "film" },
    { name: "Other", color: "#14b8a6", icon: "tag" },
  ];

  const createdCategories = await prisma.category.createMany({
    data: defaultCategories.map((c) => ({ ...c, userId: user.id })),
  });

  // Create default expenses
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  });

  const categoryMap = {};
  categories.forEach((cat) => {
    categoryMap[cat.name] = cat.id;
  });

  const today = new Date();
  const defaultExpenses = [
    {
      title: "Breakfast",
      amount: 250,
      description: "Morning coffee and breakfast",
      date: today,
      categoryId: categoryMap["Food"],
    },
    {
      title: "Metro Pass",
      amount: 500,
      description: "Monthly transport pass",
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      categoryId: categoryMap["Transport"],
    },
    {
      title: "Movie Tickets",
      amount: 800,
      description: "Movie night",
      date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      categoryId: categoryMap["Entertainment"],
    },
    {
      title: "Electricity Bill",
      amount: 1500,
      description: "Monthly electricity",
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      categoryId: categoryMap["Bills"],
    },
  ];

  await prisma.expense.createMany({
    data: defaultExpenses.map((exp) => ({ ...exp, userId: user.id })),
  });

  return user;
}

async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);
  const { password: _pw, ...safeUser } = user;

  return { token, user: safeUser };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

async function updateProfile(userId, name, email) {
  if (email) {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (existing) {
      throw new Error("Email is already in use by another account");
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
    },
  });

  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

async function changePassword(userId, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    throw new Error("Current and new password are required");
  }
  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
};
