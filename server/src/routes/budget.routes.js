const express = require("express");
const router = express.Router();

const budgetController = require("../controllers/budget.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", budgetController.list);
router.post("/", budgetController.set);
router.delete("/:id", budgetController.remove);

module.exports = router;
