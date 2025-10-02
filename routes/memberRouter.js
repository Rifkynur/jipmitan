const express = require("express");
const router = express.Router();
const {
  getAllMembers,
  addMembers,
  getDetialsMembers,
  editMembers,
  deleteMember,
} = require("../controllers/memberController");
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/authMiddleware");

router.get("/members", getAllMembers);
router.get("/members/:id", getDetialsMembers);
router.post("/members", authMiddleware, addMembers);
router.patch("/members/:id", authMiddleware, editMembers);
router.delete("/members/:id", authMiddleware, deleteMember);

module.exports = router;
