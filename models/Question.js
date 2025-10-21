const mongoose = require("mongoose");
const slugify = require("slugify");

const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      minlength: [10, "Please provide a title at least 10 characters"],
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
      minlength: [20, "Please provide content at least 20 characters"],
    },
    slug: String,

    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },

    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    likeCount: {
      type: Number,
      default: 0,
    },

    answerCount: {
      type: Number,
      default: 0,
    },

    answers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Answer",
      },
    ],
  },
  {
    timestamps: true, // ⬅️ Otomatik createdAt & updatedAt
  }
);

// Slug oluşturma middleware’i
QuestionSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();
  this.slug = slugify(this.title, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  });
  next();
});

module.exports = mongoose.model("Question", QuestionSchema);
