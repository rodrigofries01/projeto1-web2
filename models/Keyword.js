const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Keyword = mongoose.model("Keyword", keywordSchema);

module.exports = Keyword;
