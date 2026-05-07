import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import sequelize from "./config/db.js";
import fuelRoutes from "./routes/fuelRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", fuelRoutes);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

sequelize.authenticate()
  .then(() => console.log("DB Connected"))
  .catch(err => console.error("DB Error:", err));

// start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});