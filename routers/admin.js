const express = require("express");
const {
  getAccessToRoute,
  getAdminAccess,
} = require("../middlewears/authorization/auth");

const { blockUser, deleteUser } = require("../controllers/admin");
const {
  checkUserExist,
} = require("../middlewears/database/databaseErrorHelpers");

// Block User
// Delete User

const router = express.Router();

router.use([getAccessToRoute, getAdminAccess]);

router.get("/block/:id", checkUserExist, blockUser);
router.delete("/user/:id", checkUserExist, deleteUser);

module.exports = router;
