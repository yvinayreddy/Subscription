import { useState } from 'react';
import { authService } from '../services';

/**
 * AuthForm Component
 * Handles user login and registration
 */
export const AuthForm = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await authService.login(formData.email, formData.password);
      } else {
        await authService.register(formData.name, formData.email, formData.password);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {!isLogin && (
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
        {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsLogin(!isLogin);
          setError('');
        }}
        style={{ width: '100%', marginTop: '10px', padding: '10px' }}
      >
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </form>
  );
};
