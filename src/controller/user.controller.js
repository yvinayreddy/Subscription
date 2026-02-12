const User=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");

exports.login=async (req,res)=>{
  try{
    const {email,password}=req.body;

    // validation
    if(!email || !password){
      return res.status(400).json({ ok: false, message: "Email and password are required" });
    }

    // verification
    const user=await User.findOne({email});
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Invalid credentials"
      });
    }

    // authentication
    const match=await bcrypt.compare(password,user.password);
    if(!match){
      return res.status(401).json({
        ok: false, message: "Invalid credentials"
      });
    }

    // token creation
    const token=jwt.sign(
      {userId:user._id},
      process.env.JWT_SECRET,
      {expiresIn:'7d'}
    );

    return res.status(200).json({
      ok: true,
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });

  }catch (err) {
    return res.status(500).json({
      ok: false, message: err.message
    });
  }
}

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Name, email, and password are required"
      });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    // Name validation
    if (trimmedName.length < 2) {
      return res.status(400).json({
        ok: false,
        message: "Name must be at least 2 characters"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid email format"
      });
    }

    // Password validation
    if (String(password).length < 6) {
      return res.status(400).json({
        ok: false,
        message: "Password must be at least 6 characters"
      });
    }

    // Check existing email
    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
        return res.status(409).json({
            ok: false,
            message: "Email already registered"
        });
    }
    
    // hashing password by bcrypt and adding into DB
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashed
    });

    return res.status(201).json({
      ok: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
};
