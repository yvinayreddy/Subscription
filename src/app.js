require('dotenv').config();
const express = require('express');
const postRoutes = require('./routes/post.route');
const userRoutes = require('./routes/user.route');
const authRoutes=require("../src/routes/authRoutes");
const planRoutes=require("../src/routes/planRoutes");
const subscriptionRoutes=require("../src/routes/subscriptionRoutes");

const app = express();
app.use(express.json());

app.use('/api/post', postRoutes);
app.use('/api/auth', userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/plan",planRoutes);
app.use("/api/subscription",subscriptionRoutes);

module.exports = app;
