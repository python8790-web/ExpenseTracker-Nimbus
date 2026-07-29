const budgetService = require("../services/budget.service");

async function set(req, res) {
  try {
    const { month, year, amount } = req.body;
    const budget = await budgetService.setBudget(req.user.id, month, year, amount);
    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function list(req, res) {
  try {
    const budgets = await budgetService.getBudgets(req.user.id);
    res.status(200).json(budgets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    await budgetService.deleteBudget(req.params.id, req.user.id);
    res.status(200).json({ message: "Budget deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { set, list, remove };
