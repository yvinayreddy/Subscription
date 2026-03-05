const request = require('supertest');
const app = require('../../app');
const postService = require('../services/post.service');

// bypass auth middleware during tests
jest.mock('../middlewares/auth.middleware', () => ({
  protect: (req, res, next) => {
    req.user = { _id: 'user123' };
    next();
  },
}));

jest.mock('../services/post.service');

describe('Post Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/posts', () => {
    test('should return 200 and pagination data', async () => {
      postService.getAllPosts.mockResolvedValue({
        posts: [],
        pagination: { currentPage: 1, totalPages: 1 }
      });

      const res = await request(app).get('/api/posts');
      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    test('should validate user id filter', async () => {
      const res = await request(app).get('/api/posts').query({ user: 'notanid' });
      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('INVALID_ID_FORMAT');
    });

    test('should cap limit at 100', async () => {
      postService.getAllPosts.mockResolvedValue({
        posts: [],
        pagination: { currentPage: 1, totalPages: 1, limit: 100 }
      });

      const res = await request(app).get('/api/posts').query({ limit: '1000' });
      expect(res.statusCode).toBe(200);
      expect(res.body.pagination.limit).toBe(100);
    });
  });

  describe('POST /api/posts', () => {
    test('should require image file', async () => {
      const res = await request(app).post('/api/posts').field('caption', 'hello');
      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('MISSING_REQUIRED_FIELDS');
    });

    test('should reject long caption', async () => {
      const long = 'a'.repeat(501);
      const res = await request(app)
        .post('/api/posts')
        .field('caption', long)
        .attach('image', Buffer.from('test'), 'test.jpg');
      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('CAPTION_TOO_LONG');
    });
  });
});
