import { useState, useEffect } from 'react';
import { subscriptionService, authService } from '../services';

/**
 * SubscriptionManager Component
 * Displays and manages user subscriptions
 */
export const SubscriptionManager = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);
  const user = authService.getUser();

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getUserSubscriptions(user.id);
      setSubscriptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      setCancelling(subscriptionId);
      await subscriptionService.cancel(subscriptionId);
      await loadSubscriptions();
      alert('Subscription cancelled successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(null);
    }
  };

  if (!user) {
    return <div>Please login to view subscriptions</div>;
  }

  if (loading) return <div>Loading subscriptions...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>My Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p>No subscriptions yet</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th>Plan</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map(sub => (
              <tr key={sub._id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{sub.plan?.name}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: sub.status === 'active' ? '#4caf50' : '#f44336',
                    color: 'white'
                  }}>
                    {sub.status}
                  </span>
                </td>
                <td>{new Date(sub.startDate).toLocaleDateString()}</td>
                <td>{new Date(sub.endDate).toLocaleDateString()}</td>
                <td>
                  {sub.status === 'active' && (
                    <button
                      onClick={() => handleCancel(sub._id)}
                      disabled={cancelling === sub._id}
                      style={{ padding: '6px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      {cancelling === sub._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
