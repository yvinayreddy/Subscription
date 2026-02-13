import { useEffect, useMemo, useState } from 'react';
import { authApi, planApi, subscriptionApi } from './api';
import './App.css';

const tabs = [
  { key: 'auth', label: 'Auth' },
  { key: 'plans', label: 'Plans' },
  { key: 'subscriptions', label: 'Subscriptions' }
];

function emptyMessage() {
  return { type: '', text: '' };
}

function App() {
  const [activeTab, setActiveTab] = useState('auth');
  const [message, setMessage] = useState(emptyMessage());
  const [loading, setLoading] = useState(false);

  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('subscription_app_auth');
    if (!stored) return { token: '', user: null };

    try {
      return JSON.parse(stored);
    } catch {
      return { token: '', user: null };
    }
  });

  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const [plans, setPlans] = useState([]);
  const [planForm, setPlanForm] = useState({ name: '', price: '', duration: '' });
  const [editingPlanId, setEditingPlanId] = useState('');

  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionForm, setSubscriptionForm] = useState({ userId: '', planId: '' });
  const [subscriptionQuery, setSubscriptionQuery] = useState({ status: '', userId: '' });
  const [subscriptionIdLookup, setSubscriptionIdLookup] = useState('');
  const [subscriptionDetail, setSubscriptionDetail] = useState(null);

  const isAuthenticated = Boolean(auth.token);
  const isAdmin = auth.user?.role === 'admin';

  useEffect(() => {
    localStorage.setItem('subscription_app_auth', JSON.stringify(auth));
  }, [auth]);

  const clearMessage = () => setMessage(emptyMessage());

  const setSuccess = (text) => setMessage({ type: 'success', text });
  const setError = (text) => setMessage({ type: 'error', text });

  const onRegister = async (event) => {
    event.preventDefault();
    clearMessage();
    setLoading(true);

    try {
      const data = await authApi.register(registerForm);
      setRegisterForm({ name: '', email: '', password: '' });
      setSuccess(`Registered ${data.user?.email || 'user'} successfully. Now login.`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();
    clearMessage();
    setLoading(true);

    try {
      const data = await authApi.login(loginForm);
      setAuth({ token: data.token, user: data.user });
      setLoginForm({ email: '', password: '' });
      setSuccess(`Logged in as ${data.user?.email || 'user'}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth({ token: '', user: null });
    setSubscriptions([]);
    setSubscriptionDetail(null);
    setSuccess('Logged out');
  };

  const fetchPlans = async () => {
    clearMessage();
    setLoading(true);

    try {
      const data = await planApi.getAll();
      setPlans(data.plans || []);
      setSuccess(`Loaded ${data.count || 0} plans`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSavePlan = async (event) => {
    event.preventDefault();
    clearMessage();
    setLoading(true);

    const payload = {
      name: planForm.name,
      price: Number(planForm.price),
      duration: Number(planForm.duration)
    };

    try {
      if (editingPlanId) {
        await planApi.update(editingPlanId, payload);
        setSuccess('Plan updated');
      } else {
        await planApi.create(payload);
        setSuccess('Plan created');
      }

      setPlanForm({ name: '', price: '', duration: '' });
      setEditingPlanId('');
      await fetchPlans();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const onEditPlan = (plan) => {
    setEditingPlanId(plan._id);
    setPlanForm({
      name: plan.name || '',
      price: plan.price?.toString() || '',
      duration: plan.duration?.toString() || ''
    });
  };

  const onDeletePlan = async (id) => {
    clearMessage();
    setLoading(true);

    try {
      await planApi.remove(id);
      setSuccess('Plan deleted');
      await fetchPlans();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const createSubscription = async (event) => {
    event.preventDefault();
    clearMessage();

    if (!isAuthenticated) {
      setError('Login required');
      return;
    }

    setLoading(true);
    try {
      await subscriptionApi.create(subscriptionForm, auth.token);
      setSubscriptionForm({ userId: '', planId: '' });
      setSuccess('Subscription created');
      await loadSubscriptions();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const loadSubscriptions = async () => {
    clearMessage();

    if (!isAuthenticated) {
      setError('Login required');
      return;
    }

    setLoading(true);

    const query = {
      ...(subscriptionQuery.status ? { status: subscriptionQuery.status } : {}),
      ...(subscriptionQuery.userId ? { userId: subscriptionQuery.userId } : {})
    };

    try {
      const data = await subscriptionApi.getAll(query, auth.token);
      setSubscriptions(data.subscriptions || []);
      setSuccess(`Loaded ${data.count || 0} subscriptions`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptionById = async (event) => {
    event.preventDefault();
    clearMessage();

    if (!isAuthenticated) {
      setError('Login required');
      return;
    }

    setLoading(true);

    try {
      const data = await subscriptionApi.getById(subscriptionIdLookup, auth.token);
      setSubscriptionDetail(data.subscription);
      setSuccess('Subscription loaded');
    } catch (error) {
      setError(error.message);
      setSubscriptionDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (id) => {
    clearMessage();

    if (!isAuthenticated) {
      setError('Login required');
      return;
    }

    setLoading(true);

    try {
      await subscriptionApi.cancel(id, auth.token);
      setSuccess('Subscription cancelled');
      await loadSubscriptions();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const authBadge = useMemo(() => {
    if (!auth.user) return 'Not logged in';
    return `${auth.user.name || 'User'} (${auth.user.role})`;
  }, [auth.user]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Subscription Admin Console</h1>
          <p>Frontend for auth, plans, and subscriptions backend logic.</p>
        </div>
        <div className="session-box">
          <span>{authBadge}</span>
          <button type="button" className="secondary" onClick={logout} disabled={!isAuthenticated || loading}>
            Logout
          </button>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={tab.key === activeTab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {message.text && (
        <div className={message.type === 'error' ? 'alert error' : 'alert success'}>
          {message.text}
        </div>
      )}

      {activeTab === 'auth' && (
        <section className="grid two-col">
          <article className="card">
            <h2>Register</h2>
            <form onSubmit={onRegister}>
              <label>
                Name
                <input
                  value={registerForm.name}
                  onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  minLength={6}
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                  required
                />
              </label>
              <button type="submit" disabled={loading}>Create Account</button>
            </form>
          </article>

          <article className="card">
            <h2>Login</h2>
            <form onSubmit={onLogin}>
              <label>
                Email
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                  required
                />
              </label>
              <button type="submit" disabled={loading}>Login</button>
            </form>
          </article>
        </section>
      )}

      {activeTab === 'plans' && (
        <section className="grid two-col">
          <article className="card">
            <h2>{editingPlanId ? 'Edit Plan' : 'Create Plan'}</h2>
            <form onSubmit={onSavePlan}>
              <label>
                Name
                <input
                  value={planForm.name}
                  onChange={(event) => setPlanForm({ ...planForm, name: event.target.value })}
                  required
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  min="0"
                  value={planForm.price}
                  onChange={(event) => setPlanForm({ ...planForm, price: event.target.value })}
                  required
                />
              </label>
              <label>
                Duration (days)
                <input
                  type="number"
                  min="1"
                  value={planForm.duration}
                  onChange={(event) => setPlanForm({ ...planForm, duration: event.target.value })}
                  required
                />
              </label>
              <div className="row">
                <button type="submit" disabled={loading}>
                  {editingPlanId ? 'Update Plan' : 'Create Plan'}
                </button>
                {editingPlanId && (
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setEditingPlanId('');
                      setPlanForm({ name: '', price: '', duration: '' });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </article>

          <article className="card">
            <div className="row row-space">
              <h2>Plan List</h2>
              <button type="button" className="secondary" onClick={fetchPlans} disabled={loading}>
                Refresh
              </button>
            </div>
            {plans.length === 0 ? (
              <p className="muted">No plans loaded.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan._id}>
                        <td>{plan.name}</td>
                        <td>{plan.price}</td>
                        <td>{plan.duration}</td>
                        <td>{plan.isActive ? 'Yes' : 'No'}</td>
                        <td className="row">
                          <button type="button" className="mini" onClick={() => onEditPlan(plan)}>
                            Edit
                          </button>
                          <button type="button" className="mini danger" onClick={() => onDeletePlan(plan._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </section>
      )}

      {activeTab === 'subscriptions' && (
        <section className="grid two-col">
          <article className="card">
            <h2>Create Subscription</h2>
            <p className="muted">Requires login token. Uses POST /api/subscription.</p>
            <form onSubmit={createSubscription}>
              <label>
                User ID
                <input
                  value={subscriptionForm.userId}
                  onChange={(event) => setSubscriptionForm({ ...subscriptionForm, userId: event.target.value })}
                  required
                />
              </label>
              <label>
                Plan ID
                <input
                  value={subscriptionForm.planId}
                  onChange={(event) => setSubscriptionForm({ ...subscriptionForm, planId: event.target.value })}
                  required
                />
              </label>
              <button type="submit" disabled={loading || !isAuthenticated}>Create</button>
            </form>

            <hr />

            <h3>Find By ID</h3>
            <form onSubmit={loadSubscriptionById}>
              <label>
                Subscription ID
                <input
                  value={subscriptionIdLookup}
                  onChange={(event) => setSubscriptionIdLookup(event.target.value)}
                  required
                />
              </label>
              <button type="submit" disabled={loading || !isAuthenticated}>Load</button>
            </form>

            {subscriptionDetail && (
              <pre>{JSON.stringify(subscriptionDetail, null, 2)}</pre>
            )}
          </article>

          <article className="card">
            <div className="row row-space">
              <h2>Subscription List</h2>
              <button type="button" className="secondary" onClick={loadSubscriptions} disabled={loading || !isAuthenticated}>
                Refresh
              </button>
            </div>

            <div className="grid filters">
              <label>
                Status
                <select
                  value={subscriptionQuery.status}
                  onChange={(event) => setSubscriptionQuery({ ...subscriptionQuery, status: event.target.value })}
                >
                  <option value="">All</option>
                  <option value="active">active</option>
                  <option value="cancel">cancel</option>
                  <option value="expired">expired</option>
                </select>
              </label>
              <label>
                User ID
                <input
                  value={subscriptionQuery.userId}
                  onChange={(event) => setSubscriptionQuery({ ...subscriptionQuery, userId: event.target.value })}
                  placeholder="optional"
                />
              </label>
            </div>
            <p className="muted">Filtering /api/subscription (admin only in backend). Logged-in role: {isAuthenticated ? auth.user?.role : 'none'}.</p>
            {!isAdmin && <p className="warn">If your role is not admin, list call may return 403.</p>}

            {subscriptions.length === 0 ? (
              <p className="muted">No subscriptions loaded.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((item) => (
                      <tr key={item._id}>
                        <td className="id">{item._id}</td>
                        <td>{item.user?.email || item.user}</td>
                        <td>{item.plan?.name || item.plan}</td>
                        <td>{item.status}</td>
                        <td>{new Date(item.startDate).toLocaleDateString()}</td>
                        <td>{new Date(item.endDate).toLocaleDateString()}</td>
                        <td>
                          <button
                            type="button"
                            className="mini danger"
                            onClick={() => cancelSubscription(item._id)}
                            disabled={item.status === 'cancel'}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </section>
      )}
    </div>
  );
}

export default App;
