// controllers/planController.js
const Plan = require("../models/Plan.model");
const { validateRequired, validateObjectId, handleValidationError, sendValidationError, sendError } = require('../utils/validation');

/**
 * CREATE PLAN (Admin)
 */
exports.createPlan = async (req, res) => {
  try {
    const { name, price, duration } = req.body;

    // Validate required fields
    if (sendValidationError(res, validateRequired({ name, price, duration }, ['name', 'price', 'duration']))) return;

    const plan = await Plan.create({
      name,
      price,
      duration
    });

    res.status(201).json({
      ok: true,
      message: "Plan created successfully",
      plan
    });

  } catch (error) {
    const err = handleValidationError(error);
    if (err) {
      return sendError(res, err.status, err.message, err.code);
    }

    return sendError(res, 500, error.message);
  }
};

/**
 * GET ALL PLANS (Public)
 */
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();

    res.status(200).json({
      ok: true,
      count: plans.length,
      plans
    });

  } catch (error) {
    return sendError(res, 500, error.message);
  }
};


/**
 * GET SINGLE PLAN
 */
exports.getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    if (sendValidationError(res, validateObjectId(id, 'Plan ID'))) return;

    const plan = await Plan.findById(id);

    if (!plan) {
      return sendError(res, 404, "Plan not found", 'PLAN_NOT_FOUND');
    }

    res.status(200).json({
      ok: true,
      plan
    });

  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * UPDATE PLAN (Admin)
 */
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (sendValidationError(res, validateObjectId(id, 'Plan ID'))) return;

    const plan = await Plan.findByIdAndUpdate(id, req.body, { new: true });

    if (!plan) {
      return sendError(res, 404, "Plan not found", 'PLAN_NOT_FOUND');
    }

    res.status(200).json({
      ok: true,
      message: "Plan updated successfully",
      plan
    });

  } catch (error) {
    const err = handleValidationError(error);
    if (err) {
      return sendError(res, err.status, err.message, err.code);
    }

    return sendError(res, 500, error.message);
  }
};

/**
 * DELETE PLAN (Admin)
 */
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (sendValidationError(res, validateObjectId(id, 'Plan ID'))) return;

    const plan = await Plan.findByIdAndDelete(id);

    if (!plan) {
      return sendError(res, 404, "Plan not found", 'PLAN_NOT_FOUND');
    }

    res.status(200).json({
      ok: true,
      message: "Plan deleted successfully"
    });

  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

