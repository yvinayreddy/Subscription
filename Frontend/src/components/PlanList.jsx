import { useState, useEffect } from 'react';
import { planService, subscriptionService, authService } from '../services';

/**
 * PlanList Component
 * Displays all available plans with subscription option
 */
export const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribing, setSubscribing] = useState(null);
  const user = authService.getUser();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await planService.getAll();
      setPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!user) {
      alert('Please login first');
      return;
    }

    try {
      setSubscribing(planId);
      await subscriptionService.create(user.id, planId);
      alert('Subscription created successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) return <div>Loading plans...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Available Plans</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {plans.map(plan => (
          <div key={plan._id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <h3>{plan.name}</h3>
            <p>Price: ${plan.price}</p>
            <p>Duration: {plan.duration} days</p>
            <button
              onClick={() => handleSubscribe(plan._id)}
              disabled={subscribing === plan._id}
              style={{ width: '100%', padding: '10px' }}
            >
              {subscribing === plan._id ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
