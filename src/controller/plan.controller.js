// controllers/planController.js
const Plan = require("../models/Plan");

/**
 * CREATE PLAN (Admin)
 */
exports.createPlan = async (req, res) => {
  try {
    const { name, price, durationInDays, features } = req.body;

    const plan = await Plan.create({
      name,
      price,
      durationInDays,
      features
    });

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      plan
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET ALL PLANS (Public)
 */
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();

    res.status(200).json({
      success: true,
      plans
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET SINGLE PLAN
 */
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(plan);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PLAN (Admin)
 */
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Plan updated",
      plan
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE PLAN (Admin)
 */
exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Plan deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

