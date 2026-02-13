const User=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");
const { validateRequired, handleValidationError, sendValidationError, sendError } = require('../utils/validation');

exports.login=async (req,res)=>{
  try{
    const {email,password}=req.body;

    // Validate required fields
    if (sendValidationError(res, validateRequired({ email, password }, ['email', 'password']))) return;

    // Verification - include password field since it's hidden by default
    const user=await User.findOne({email}).select('+password');
    if (!user) {
      return sendError(res, 401, "Invalid credentials", 'INVALID_CREDENTIALS');
    }

    // Authentication
    const match=await bcrypt.compare(password,user.password);
    if(!match){
      return sendError(res, 401, "Invalid credentials", 'INVALID_CREDENTIALS');
    }

    // Token creation
    const token=jwt.sign(
      {userId:user._id},
      process.env.JWT_SECRET,
      {expiresIn:'7d'}
    );

    return res.status(200).json({
      ok: true,
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });

  }catch (err) {
    return sendError(res, 500, err.message);
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

    // Create user - all validation & trimming handled by schema
    const user = await User.create({
      name,
      email,
      password
    });

    return res.status(201).json({
      ok: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    const error = handleValidationError(err);
    if (error) {
      return sendError(res, error.status, error.message, error.code);
    }

    return sendError(res, 500, err.message);
  }
};
