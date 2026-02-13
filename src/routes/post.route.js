const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const { createPost, getAllPosts,getPostById,deletePostById } = require('../controller/post.controller');
const {protect}=require('../middlewares/user.middleware');

router.get('/', getAllPosts);
router.get('/:postId', getPostById);

router.post('/',protect, upload.single('image'), createPost);

router.delete('/:postId',protect,deletePostById);

module.exports = router;