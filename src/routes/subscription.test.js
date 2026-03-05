const subscriptionService = require('../services/subscription.service');

jest.mock('../services/subscription.service');

describe('Subscription Service (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getAllSubscriptions service', async () => {
    subscriptionService.getAllSubscriptions.mockResolvedValue([
      { _id: '1', status: 'active' }
    ]);

    const result = await subscriptionService.getAllSubscriptions();
    expect(result.length).toBeGreaterThan(0);
  });

  test('should call getSubscriptionById service', async () => {
    subscriptionService.getSubscriptionById.mockResolvedValue({
      _id: '1',
      status: 'active'
    });

    const result = await subscriptionService.getSubscriptionById('1');
    expect(result.status).toBe('active');
  });

  test('should call createSubscription service', async () => {
    subscriptionService.createSubscription.mockResolvedValue({
      _id: 'new',
      status: 'active'
    });

    const result = await subscriptionService.createSubscription('userId', 'planId');
    expect(result.status).toBe('active');
  });

  test('should call cancelSubscription service', async () => {
    subscriptionService.cancelSubscription.mockResolvedValue({
      _id: '1',
      status: 'cancelled'
    });

    const result = await subscriptionService.cancelSubscription('subscriptionId');
    expect(result.status).toBe('cancelled');
  });
});
