const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
  },
  {
    collection: "projects", // Nome da coleção no banco de dados
    timestamps: true, // Cria campos createdAt e updatedAt automaticamente
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
