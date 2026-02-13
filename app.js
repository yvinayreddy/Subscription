require('dotenv').config();
const express = require('express');
const postRoutes = require('./src/routes/post.route');
const userRoutes = require('./src/routes/user.route');
const planRoutes=require("./src/routes/plan.routes");
const subscriptionRoutes=require("./src/routes/subscription.routes");

const app = express();
app.use(express.json());

app.use('/api/post', postRoutes);
app.use('/api/auth', userRoutes);
app.use("/api/plan",planRoutes);
app.use("/api/subscription",subscriptionRoutes);

module.exports = app;

