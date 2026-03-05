require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const postRoutes = require('./src/routes/post.routes');
const userRoutes = require('./src/routes/user.routes');
const planRoutes=require("./src/routes/plan.routes");
const subscriptionRoutes=require("./src/routes/subscription.routes");
const { setupSwagger, limiter } = require('./src/config/api.config');
const errorMiddleware = require('./src/middlewares/error.middleware');

const app = express();
app.use(express.json());
app.use(cors());


// Swagger setup
setupSwagger(app);
// security headers
app.use(helmet());
app.use(limiter);
app.use('/api/posts', postRoutes);
app.use('/api/auths', userRoutes);
app.use("/api/plans",planRoutes);
app.use("/api/subscriptions",subscriptionRoutes);
app.use(errorMiddleware);


module.exports = app;