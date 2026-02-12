const request = require('supertest');
const app = require('../../app');

// Mock Post model methods
const Post = require('../models/post.model');
jest.mock('../models/post.model');

// Mock upload service (ImageKit)
jest.mock('../services/post.service', () => jest.fn().mockResolvedValue({ url: 'https://example.com/image.jpg' }));

// Replace protect middleware with a no-op that attaches a user
jest.mock('../middlewares/user.middleware', () => ({
  protect: (req, res, next) => {
    req.user = { _id: 'userId123', name: 'Test' };
    next();
  }
}));

beforeEach(() => {
  // chainable mock for find().sort().limit().skip() -> resolves to array
  Post.find.mockImplementation(() => ({
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockResolvedValue([{ _id: '1', caption: 'Hello', image: 'url1', user: 'userId123' }])
  }));

  Post.countDocuments = jest.fn().mockResolvedValue(1);

  // For create/post test if you call Post.create
  Post.create = jest.fn().mockResolvedValue({
    _id: '2',
    image: 'https://example.com/image.jpg',
    caption: 'My first post',
    user: 'userId123'
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Post Routes', () => {

  test('GET /api/post - should fetch all posts', async () => {
    const response = await request(app)
      .get('/api/post')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(1);
  });

  test('POST /api/post - should create post with auth token', async () => {
    const token = 'valid.jwt.token';
    
    const response = await request(app)
      .post('/api/post')
      .set('Authorization', `Bearer ${token}`)
      .field('caption', 'My first post')
      .field('user', 'userId123')
      .attach('image', Buffer.from('fake-image'), 'image.jpg');

    expect(response.status).toBe(201);
  });

});