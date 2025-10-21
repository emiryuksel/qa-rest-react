const express = require("express");
const { getSingleUser, getAllUsers } = require("../controllers/user.js");
const {
  checkUserExist,
} = require("../middlewears/database/databaseErrorHelpers.js");

const User = require("../models/user.js");
const userQueryMiddleware = require("../middlewears/query/userQueryMiddleware");

const router = express.Router();
router.get("/", userQueryMiddleware(User), getAllUsers);
router.get("/:id", checkUserExist, getSingleUser);

module.exports = router;
