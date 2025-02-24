const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    tf_name: {
      type: String,
      required: true,
      unique: true,
    },
    tf_email: {
      type: String,
      required: true,
      unique: true,
    },
    tf_senha: {
      type: String,
      required: true,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("usuarios", UserSchema);
