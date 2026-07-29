const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expense.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/summary", expenseController.summary);
router.get("/", expenseController.list);
router.post("/", expenseController.create);
router.get("/:id", expenseController.getOne);
router.put("/:id", expenseController.update);
router.delete("/:id", expenseController.remove);

module.exports = router;
