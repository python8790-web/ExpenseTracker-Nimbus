const authService = require("../services/auth.service");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const user = await authService.registerUser(name, email, password);

    const { password: _, ...safeUser } = user;

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

async function getMe(req, res) {
  try {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function updateMe(req, res) {
  try {
    const { name, email } = req.body;
    const user = await authService.updateProfile(req.user.id, name, email);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { register, login, getMe, updateMe, changePassword };
