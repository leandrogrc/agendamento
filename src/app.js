const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const { swaggerUi, specs } = require("./swagger");
const authMiddleware = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");
const nunjucks = require("nunjucks");

const app = express();
nunjucks.configure("src/views", {
  autoescape: true,
  express: app,
  watch: true, // recarrega os templates automaticamente no dev
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.set("view engine", "njk");
app.use(express.static("public"));

// API Routes
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware, userRoutes);

// Web Routes
app.get("/", (req, res) => res.render("index.njk"));

// Sync database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Tabelas sincronizadas com sucesso");
  })
  .catch((err) => {
    console.error("Erro ao sincronizar tabelas:", err);
  });
module.exports = app;
