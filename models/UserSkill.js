const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSkillSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Nome do modelo de usuários
      required: true,
    },
    skillId: {
      type: Schema.Types.ObjectId,
      ref: "Skill", // Nome do modelo de habilidades
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true, // Adiciona colunas createdAt e updatedAt
    collection: "user_skills", // Nome da coleção no banco de dados
  }
);

module.exports = mongoose.model("UserSkill", UserSkillSchema);
