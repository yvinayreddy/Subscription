const planService = require('./plan.service');
const Plan = require('../models/plan.model');

jest.mock('../models/plan.model');

describe('Plan Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlan', () => {
    test('should create plan with valid data', async () => {
      const mockPlan = {
        _id: 'plan1',
        name: 'Basic Plan',
        price: 99,
        duration: 30,
        isActive: true
      };

      Plan.create.mockResolvedValue(mockPlan);

      const result = await planService.createPlan('Basic Plan', 99, 30);

      expect(result).toEqual(mockPlan);
      expect(Plan.create).toHaveBeenCalledWith({
        name: 'Basic Plan',
        price: 99,
        duration: 30
      });
    });
  });

  describe('getPlans', () => {
    test('should fetch all plans', async () => {
      const mockPlans = [
        { _id: '1', name: 'Basic', price: 99, duration: 30 },
        { _id: '2', name: 'Pro', price: 199, duration: 30 }
      ];

      Plan.find.mockResolvedValue(mockPlans);

      const result = await planService.getPlans();

      expect(result).toEqual(mockPlans);
      expect(Plan.find).toHaveBeenCalled();
    });

    test('should return empty array when no plans exist', async () => {
      Plan.find.mockResolvedValue([]);

      const result = await planService.getPlans();

      expect(result).toEqual([]);
    });
  });

  describe('getPlanById', () => {
    test('should fetch plan by ID', async () => {
      const mockPlan = { _id: '1', name: 'Basic', price: 99, duration: 30 };
      Plan.findById.mockResolvedValue(mockPlan);

      const result = await planService.getPlanById('1');

      expect(result).toEqual(mockPlan);
      expect(Plan.findById).toHaveBeenCalledWith('1');
    });

    test('should throw error for non-existent plan', async () => {
      Plan.findById.mockResolvedValue(null);

      await expect(planService.getPlanById('999')).rejects.toMatchObject({
        status: 404,
        message: 'Plan not found',
        code: 'PLAN_NOT_FOUND'
      });
    });
  });

  describe('updatePlan', () => {
    test('should update plan', async () => {
      const updatedPlan = { _id: '1', name: 'Updated Plan', price: 149, duration: 30 };
      Plan.findByIdAndUpdate.mockResolvedValue(updatedPlan);

      const result = await planService.updatePlan('1', { price: 149 });

      expect(result).toEqual(updatedPlan);
      expect(Plan.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { price: 149 },
        { new: true, runValidators: true }
      );
    });

    test('should throw error for non-existent plan', async () => {
      Plan.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        planService.updatePlan('999', { price: 299 })
      ).rejects.toMatchObject({
        status: 404,
        code: 'PLAN_NOT_FOUND'
      });
    });
  });

  describe('deletePlan', () => {
    test('should delete plan', async () => {
      const deletedPlan = { _id: '1', name: 'Deleted Plan' };
      Plan.findByIdAndDelete.mockResolvedValue(deletedPlan);

      const result = await planService.deletePlan('1');

      expect(result).toEqual(deletedPlan);
      expect(Plan.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    test('should throw error for non-existent plan', async () => {
      Plan.findByIdAndDelete.mockResolvedValue(null);

      await expect(planService.deletePlan('999')).rejects.toMatchObject({
        status: 404,
        code: 'PLAN_NOT_FOUND'
      });
    });
  });
});
