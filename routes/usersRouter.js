const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/authMiddleware");

const {
  getAllUsers,
  addUsers,
  getDetailUsers,
  editUsers,
  deleteUsers,
} = require("../controllers/usersController");

router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getDetailUsers);
router.post("/users", authMiddleware, addUsers);
router.patch("/users/:id", authMiddleware, editUsers);
router.delete("/users/:id", authMiddleware, deleteUsers);
module.exports = router;
