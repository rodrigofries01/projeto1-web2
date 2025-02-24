const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const routes = require("./routes/routes");

app.use(express.json()); // Middleware para parsing de JSON
app.use(express.urlencoded({ extended: true })); // Middleware para parsing de URL-encoded

app.use(express.static(path.join(__dirname, "public")));

// Use as rotas consolidadas
app.use("/", routes);

// Serve the index.html file for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
