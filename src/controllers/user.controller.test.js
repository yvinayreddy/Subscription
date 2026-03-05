const userController = require('./user.controller');

describe('User Controller', () => {
  test('exports login function', () => {
    expect(typeof userController.login).toBe('function');
  });

  test('exports register function', () => {
    expect(typeof userController.register).toBe('function');
  });
});
