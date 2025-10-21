const User = require("../models/user");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const blockUser = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  user.blocked = !user.blocked;

  await user.save();
  return res.status(200).json({
    success: true,
    message: "Block- Unblock Successfull",
  });
});

const Question = require("../models/Question");

const deleteUser = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  // Soruları sil
  const result = await Question.deleteMany({ user: id });
  console.log("Deleted questions count:", result.deletedCount);

  // Kullanıcıyı sil (artık remove yerine deleteOne kullanalım)
  await User.deleteOne({ _id: id });

  return res.status(200).json({
    success: true,
    message: "User and their questions deleted successfully",
  });
});

module.exports = {
  blockUser,
  deleteUser,
};
