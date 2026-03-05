const userService = require('./user.service');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/user.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('login', () => {
    test('should login user with valid credentials', async () => {
      const mockUser = {
        _id: '1',
        email: 'john@example.com',
        password: 'hashedPassword',
        name: 'John',
        role: 'USER'
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt-token-123');

      const result = await userService.login('john@example.com', 'password123');

      expect(result.token).toBe('jwt-token-123');
      expect(result.user.email).toBe('john@example.com');
    });

    test('should throw error for non-existent user', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(
        userService.login('nonexistent@example.com', 'password')
      ).rejects.toMatchObject({
        status: 401,
        code: 'INVALID_CREDENTIALS'
      });
    });

    test('should throw error for incorrect password', async () => {
      const mockUser = {
        _id: '1',
        email: 'john@example.com',
        password: 'hashedPassword'
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        userService.login('john@example.com', 'wrongpassword')
      ).rejects.toMatchObject({
        status: 401,
        code: 'INVALID_CREDENTIALS'
      });
    });
  });

  describe('register', () => {
    test('should register new user', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: '1',
        name: 'John',
        email: 'john@example.com',
        role: 'USER'
      });

      const result = await userService.register('John', 'john@example.com', 'password123');

      expect(result.email).toBe('john@example.com');
      expect(result.name).toBe('John');
    });

    test('should throw error for duplicate email', async () => {
      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await expect(
        userService.register('Jane', 'existing@example.com', 'password123')
      ).rejects.toMatchObject({
        status: 409,
        code: 'DUPLICATE_EMAIL'
      });
    });
  });
});
