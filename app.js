const express = require("express");

const app = express();

const authRoutes=require("./routes/authRoutes");
const planRoutes=require("./routes/planRoutes");
const subscriptionRoutes=require("./routes/subscriptionRoutes");


// Middlewares
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/plan",planRoutes);
app.use("/api/subscription",subscriptionRoutes);

// Routes (later we add)
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
