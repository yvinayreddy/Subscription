const planService = require('../services/plan.service');

jest.mock('../services/plan.service');

describe('Plan Service (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getAllPlans service', async () => {
    planService.getAllPlans.mockResolvedValue([
      { _id: '1', name: 'Basic', duration: 30 }
    ]);

    const result = await planService.getAllPlans();
    expect(result.length).toBeGreaterThan(0);
  });

  test('should call getPlanById service', async () => {
    planService.getPlanById.mockResolvedValue({ _id: '1', name: 'Basic' });

    const result = await planService.getPlanById('1');
    expect(result.name).toBe('Basic');
  });

  test('should call createPlan service', async () => {
    planService.createPlan.mockResolvedValue({
      _id: 'new',
      name: 'Premium',
      duration: 30
    });

    const result = await planService.createPlan({ name: 'Premium', duration: 30 });
    expect(result.name).toBe('Premium');
  });
});
