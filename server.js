const express = require("express");
const { Pool } = require("pg");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const skillRoutes = require("./routes/skills");
const keywordRoutes = require("./routes/keywords");
const adminRoutes = require("./routes/admin");
const knowledgeRoutes = require("./routes/knowledge");
const db = require("./config/db_sequelize");
const path = require("path");
const app = express();
require("dotenv").config();

app.use("/api", require("./routes/addaluno"));
app.use(express.json()); // Middleware para parsing de JSON
app.use("/admin", require("./routes/admin"));
app.use(express.urlencoded({ extended: true })); // Middleware para parsing de URL-encoded

const verificaloginRoutes = require("./routes/verificalogin");
app.use("/auth", verificaloginRoutes);

app.use(express.static(path.join(__dirname, "public")));

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados bem-sucedida!");
    return db.sequelize.sync({ alter: true }); // Sincroniza modelos com o banco
  })
  .then(() => console.log("Modelos sincronizados com sucesso!"))
  .catch((err) => console.error("Erro ao conectar ao banco de dados:", err));

// Make the pool available to route handlers
app.use((req, res, next) => {
  req.pool = Pool;
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/skills", skillRoutes);
app.use("/keywords", keywordRoutes);
app.use("/admin", adminRoutes);
app.use("/knowledge", knowledgeRoutes);

// Serve the index.html file for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
