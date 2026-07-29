const expenseService = require("../services/expense.service");

async function create(req, res) {
  try {
    const expense = await expenseService.createExpense(req.user.id, req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function list(req, res) {
  try {
    const { categoryId, month, year, search } = req.query;
    const expenses = await expenseService.getExpenses(req.user.id, {
      categoryId,
      month,
      year,
      search,
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getOne(req, res) {
  try {
    const expense = await expenseService.getExpenseById(req.params.id, req.user.id);
    res.status(200).json(expense);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const expense = await expenseService.updateExpense(
      req.params.id,
      req.user.id,
      req.body
    );
    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    await expenseService.deleteExpense(req.params.id, req.user.id);
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function summary(req, res) {
  try {
    const { month, year } = req.query;
    const data = await expenseService.getSummary(req.user.id, { month, year });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { create, list, getOne, update, remove, summary };
