const planService = require('../services/plan.service');
const { validateRequired, validateObjectId, sendValidationError } = require('../utils/validation');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create a new subscription plan.
 *
 * Handles the creation of a new plan with name, price, and duration.
 * Only accessible to admin users.
 *
 * @route POST /api/plans
 * @access Private (Admin)
 *
 * @param {Object} req.body
 * @param {string} req.body.name - Name of the plan
 * @param {number} req.body.price - Price of the plan
 * @param {number} req.body.duration - Duration in days
 *
 * @returns {Object} JSON response containing created plan
 *
 * @throws {400} If required fields are missing
 */
/**
 * @swagger
 * /api/plans:
 *   post:
 *     summary: Create a subscription plan
 *     tags:
 *       - Plans
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlanInput'
 *     responses:
 *       201:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Plan created successfully
 *                 plan:
 *                   $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.createPlan = asyncHandler(async (req, res) => {
  const { name, price, duration } = req.body;

  if (sendValidationError(res, validateRequired({ name, price, duration }, ['name', 'price', 'duration']))) return;

  const plan = await planService.createPlan(name, price, duration);

  res.status(201).json({
    ok: true,
    message: "Plan created successfully",
    plan
  });
});

/**
 * Get all subscription plans.
 *
 * Retrieves a list of all available plans.
 * Public access.
 *
 * @route GET /api/plans
 * @access Public
 *
 * @returns {Object} JSON response containing array of plans
 */
/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags:
 *       - Plans
 *     responses:
 *       200:
 *         description: Plans fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 plans:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Plan'
 */
exports.getPlans = asyncHandler(async (req, res) => {
  const plans = await planService.getPlans();

  res.status(200).json({
    ok: true,
    count: plans.length,
    plans
  });
});

/**
 * Get a single plan by ID.
 *
 * Retrieves details of a specific plan.
 * Public access.
 *
 * @route GET /api/plans/:id
 * @access Public
 *
 * @param {string} req.params.id - Plan ID
 *
 * @returns {Object} JSON response containing plan details
 *
 * @throws {400} If plan ID is invalid
 * @throws {404} If plan not found
 */
/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Get a plan by ID
 *     tags:
 *       - Plans
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 plan:
 *                   $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.getPlanById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (sendValidationError(res, validateObjectId(id, 'Plan ID'))) return;

  const plan = await planService.getPlanById(id);

  res.status(200).json({
    ok: true,
    plan
  });
});

/**
 * Update an existing plan.
 *
 * Modifies plan details. Only accessible to admin users.
 *
 * @route PUT /api/plans/:id
 * @access Private (Admin)
 *
 * @param {string} req.params.id - Plan ID
 * @param {Object} req.body - Fields to update
 *
 * @returns {Object} JSON response containing updated plan
 *
 * @throws {400} If plan ID is invalid
 * @throws {404} If plan not found
 */
/**
 * @swagger
 * /api/plans/{id}:
 *   put:
 *     summary: Update a plan by ID
 *     tags:
 *       - Plans
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePlanInput'
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Plan updated successfully
 *                 plan:
 *                   $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.updatePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (sendValidationError(res, validateObjectId(id, 'Plan ID'))) return;

  const plan = await planService.updatePlan(id, req.body);

  res.status(200).json({
    ok: true,
    message: "Plan updated successfully",
    plan
  });
});

/**
 * Delete a plan by ID.
 *
 * Removes a plan from the system. Only accessible to admin users.
 *
 * @route DELETE /api/plans/:id
 * @access Private (Admin)
 *
 * @param {string} req.params.id - Plan ID
 *
 * @returns {Object} JSON response with success message
 *
 * @throws {400} If plan ID is invalid
 * @throws {404} If plan not found
 */
/**
 * @swagger
 * /api/plans/{id}:
 *   delete:
 *     summary: Delete a plan by ID
 *     tags:
 *       - Plans
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Plan deleted successfully
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.deletePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (sendValidationError(res, validateObjectId(id, 'Plan ID'))) return;

  await planService.deletePlan(id);

  res.status(200).json({
    ok: true,
    message: "Plan deleted successfully"
  });
});

