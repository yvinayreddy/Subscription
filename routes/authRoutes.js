const express = require("express");
const router = express.Router();

const {login ,register}=require("../controllers/authController");

router.post("/api/auth/login",login);
router.post("/api/auth/register",register);

module.exports = router;