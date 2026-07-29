const categoryService = require("../services/category.service");

async function create(req, res) {
  try {
    const { name, color, icon } = req.body;
    const category = await categoryService.createCategory(
      name,
      color,
      icon,
      req.user.id
    );
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function list(req, res) {
  try {
    const categories = await categoryService.getCategories(req.user.id);
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const { name, color, icon } = req.body;
    const category = await categoryService.updateCategory(
      req.params.id,
      name,
      color,
      icon,
      req.user.id
    );
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    await categoryService.deleteCategory(req.params.id, req.user.id);
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { create, list, update, remove };
