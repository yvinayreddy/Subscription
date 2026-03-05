const Plan = require('../models/plan.model');

/**
 * Create a new subscription plan.
 *
 * Creates a plan document in the database with name, price, and duration.
 *
 * @param {string} name - Name of the plan
 * @param {number} price - Price of the plan
 * @param {number} duration - Duration in days
 *
 * @returns {Promise<Object>} Created plan document
 */
exports.createPlan = async (name, price, duration) => {
  return await Plan.create({ name, price, duration });
};

/**
 * Get all subscription plans.
 *
 * Retrieves all active plans from the database.
 *
 * @returns {Promise<Object[]>} Array of plan documents
 */
const getPlans = async () => {
  return await Plan.find();
};

//  Export both names
exports.getPlans = getPlans;
exports.getAllPlans = getPlans;

/**
 * Get a single plan by ID.
 *
 * Retrieves a specific plan document by its ID.
 *
 * @param {string} id - Plan ID
 *
 * @returns {Promise<Object>} Plan document
 *
 * @throws {Error} If plan not found
 */
exports.getPlanById = async (id) => {
  const plan = await Plan.findById(id);
  if (!plan) {
    throw { status: 404, message: 'Plan not found', code: 'PLAN_NOT_FOUND' };
  }
  return plan;
};

/**
 * Update an existing plan.
 *
 * Modifies a plan document with new data.
 *
 * @param {string} id - Plan ID
 * @param {Object} updateData - Fields to update
 *
 * @returns {Promise<Object>} Updated plan document
 *
 * @throws {Error} If plan not found
 */
exports.updatePlan = async (id, updateData) => {
  const plan = await Plan.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!plan) {
    throw { status: 404, message: 'Plan not found', code: 'PLAN_NOT_FOUND' };
  }

  return plan;
};

/**
 * Delete a plan by ID.
 *
 * Removes a plan document from the database.
 *
 * @param {string} id - Plan ID
 *
 * @returns {Promise<Object>} Deleted plan document
 *
 * @throws {Error} If plan not found
 */
exports.deletePlan = async (id) => {
  const plan = await Plan.findByIdAndDelete(id);

  if (!plan) {
    throw { status: 404, message: 'Plan not found', code: 'PLAN_NOT_FOUND' };
  }

  return plan;
};