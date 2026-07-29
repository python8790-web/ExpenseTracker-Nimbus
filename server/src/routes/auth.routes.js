const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", authMiddleware, authController.getMe);
router.put("/me", authMiddleware, authController.updateMe);
router.put("/me/password", authMiddleware, authController.changePassword);

module.exports = router;
