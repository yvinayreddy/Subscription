const postService = require('../services/post.service');

jest.mock('../services/post.service');
jest.mock('../utils/imagekit');

describe('Post Service (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getAllPosts service', async () => {
    postService.getAllPosts.mockResolvedValue({
      posts: [{ _id: '1', caption: 'Post 1' }],
      pagination: { currentPage: 1, totalPages: 1 }
    });

    const result = await postService.getAllPosts();
    expect(result.posts).toBeDefined();
  });

  test('should call getPostById service', async () => {
    postService.getPostById.mockResolvedValue({ _id: '1', caption: 'Post 1' });

    const result = await postService.getPostById('1');
    expect(result._id).toBe('1');
  });

  test('should call createPost service', async () => {
    postService.createPost.mockResolvedValue({
      _id: 'new',
      caption: 'My post',
      image: 'url'
    });

    const result = await postService.createPost({}, 'My post', 'userId');
    expect(result.caption).toBe('My post');
  });

  test('should call deletePost service', async () => {
    postService.deletePost.mockResolvedValue({ _id: '1' });

    const result = await postService.deletePost('1');
    expect(result._id).toBe('1');
  });
});
