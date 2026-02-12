const { register } = require('./user.controller');
const User = require('../models/user.model');

jest.mock('../models/user.model');

describe('User Controller - Register', () => {
  test('should register user with valid data', async () => {
    const req = {
      body: {
        name: 'John',
        email: 'john@example.com',
        password: 'password123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1, name: 'John', email: 'john@example.com' });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test('should reject duplicate email', async () => {
    const req = {
      body: { name: 'John', email: 'john@example.com', password: 'password123' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue({ email: 'john@example.com' });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });
});