const postService = require('./post.service');
const Post = require('../models/post.model');

jest.mock('../models/post.model');
jest.mock('../utils/imagekit', () => {
  return jest.fn().mockResolvedValue({
    url: 'https://imagekit.io/test-image.jpg'
  });
});

describe('Post Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPosts', () => {
    test('should fetch all posts with pagination', async () => {
      const mockPosts = [
        { _id: '1', caption: 'Post 1', image: 'url1' },
        { _id: '2', caption: 'Post 2', image: 'url2' }
      ];

      Post.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue(mockPosts)
          })
        })
      });
      Post.countDocuments.mockResolvedValue(2);

      const result = await postService.getAllPosts(1, 10);

      expect(result.posts).toEqual(mockPosts);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPosts).toBe(2);
    });

    test('should calculate pagination correctly', async () => {
      Post.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue([])
          })
        })
      });
      Post.countDocuments.mockResolvedValue(25);

      const result = await postService.getAllPosts(2, 5);

      expect(result.pagination.totalPages).toBe(5);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPrevPage).toBe(true);
    });
  });

  describe('getPostById', () => {
    test('should fetch post by ID', async () => {
      const mockPost = { _id: '1', caption: 'Post 1', image: 'url1' };
      Post.findById.mockResolvedValue(mockPost);

      const result = await postService.getPostById('1');

      expect(result).toEqual(mockPost);
    });

    test('should throw error for non-existent post', async () => {
      Post.findById.mockResolvedValue(null);

      await expect(postService.getPostById('999')).rejects.toMatchObject({
        status: 404,
        code: 'POST_NOT_FOUND'
      });
    });
  });

  describe('createPost', () => {
    test('should create post with uploaded image', async () => {
      const mockFile = { buffer: Buffer.from('image'), originalname: 'image.jpg' };

      Post.create.mockResolvedValue({
        _id: 'newPost',
        caption: 'My post',
        image: 'https://imagekit.io/test-image.jpg',
        user: 'userId123'
      });

      const result = await postService.createPost(mockFile, 'My post', 'userId123');

      expect(result.image).toBe('https://imagekit.io/test-image.jpg');
    });

    test('should throw error without file', async () => {
      await expect(
        postService.createPost(null, 'My post', 'userId123')
      ).rejects.toMatchObject({
        status: 400,
        code: 'MISSING_IMAGE'
      });
    });
  });

  describe('deletePost', () => {
    test('should delete post by ID', async () => {
      const deletedPost = { _id: '1', caption: 'Post 1' };
      Post.findByIdAndDelete.mockResolvedValue(deletedPost);

      const result = await postService.deletePost('1');

      expect(result).toEqual(deletedPost);
    });

    test('should throw error for non-existent post', async () => {
      Post.findByIdAndDelete.mockResolvedValue(null);

      await expect(postService.deletePost('999')).rejects.toMatchObject({
        status: 404,
        code: 'POST_NOT_FOUND'
      });
    });
  });
});
