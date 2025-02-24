const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  proficiency: {
    type: Number,
    required: true,
  },
});

const Skill = mongoose.model("Skill", SkillSchema);

module.exports = Skill;
