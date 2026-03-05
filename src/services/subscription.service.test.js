const subscriptionService = require('./subscription.service');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');
const Plan = require('../models/plan.model');

jest.mock('../models/subscription.model');
jest.mock('../models/user.model');
jest.mock('../models/plan.model');

describe('Subscription Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSubscription', () => {
    test('should create subscription with valid user and plan', async () => {
      const mockUser = { _id: 'userId123', name: 'John' };
      const mockPlan = { _id: 'planId123', name: 'Basic', duration: 30, isActive: true };
      const mockSubscription = {
        populate: jest.fn().mockResolvedValue({
          _id: 'subId123',
          user: { _id: 'userId123', name: 'John' },
          plan: { _id: 'planId123', name: 'Basic' }
        })
      };

      User.findById.mockResolvedValue(mockUser);
      Plan.findById.mockResolvedValue(mockPlan);
      Subscription.findOne.mockResolvedValue(null);
      Subscription.create.mockResolvedValue(mockSubscription);

      const result = await subscriptionService.createSubscription('userId123', 'planId123');

      expect(result).toBeDefined();
      expect(User.findById).toHaveBeenCalledWith('userId123');
    });

    test('should throw error for non-existent user', async () => {
      User.findById.mockResolvedValue(null);

      await expect(
        subscriptionService.createSubscription('userId999', 'planId123')
      ).rejects.toMatchObject({
        status: 404,
        code: 'USER_NOT_FOUND'
      });
    });

    test('should throw error if plan is inactive', async () => {
      const mockUser = { _id: 'userId123' };
      const mockPlan = { isActive: false };

      User.findById.mockResolvedValue(mockUser);
      Plan.findById.mockResolvedValue(mockPlan);

      await expect(
        subscriptionService.createSubscription('userId123', 'planId123')
      ).rejects.toMatchObject({
        status: 400,
        code: 'PLAN_UNAVAILABLE'
      });
    });
  });

  describe('getAllSubscriptions', () => {
    test('should fetch all subscriptions', async () => {
      const mockSubscriptions = [
        { _id: 'sub1', status: 'active' }
      ];

      Subscription.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockSubscriptions)
          })
        })
      });

      const result = await subscriptionService.getAllSubscriptions({});

      expect(result).toEqual(mockSubscriptions);
    });
  });

  describe('getSubscriptionById', () => {
    test('should fetch subscription by ID', async () => {
      const mockSubscription = {
        _id: 'sub1',
        status: 'active'
      };

      Subscription.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockSubscription)
        })
      });

      const result = await subscriptionService.getSubscriptionById('sub1');

      expect(result).toEqual(mockSubscription);
    });
  });

  describe('cancelSubscription', () => {
    test('should cancel active subscription', async () => {
      const mockSubscription = {
        _id: 'sub1',
        status: 'active',
        save: jest.fn().mockResolvedValue({})
      };

      Subscription.findById.mockResolvedValue(mockSubscription);

      await subscriptionService.cancelSubscription('sub1');

      expect(mockSubscription.status).toBe('cancelled');
      expect(mockSubscription.save).toHaveBeenCalled();
    });
  });

  describe('renewSubscription', () => {
    test('should renew active subscription', async () => {
      const mockSubscription = {
        _id: 'sub1',
        status: 'active',
        endDate: new Date(),
        save: jest.fn().mockResolvedValue({})
      };

      const mockPlan = { duration: 30 };

      Subscription.findById.mockResolvedValue(mockSubscription);
      Plan.findById.mockResolvedValue(mockPlan);

      await subscriptionService.renewSubscription('sub1');

      expect(mockSubscription.save).toHaveBeenCalled();
    });
  });
});
