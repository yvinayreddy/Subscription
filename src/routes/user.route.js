const express = require('express');
const router = express.Router();
const {login,register}=require('../controller/user.controller');

router.post('/login',login);
router.post('/register',register);

router.post('/:userId/profile');
router.post('/:userId/posts');

module.exports = router;
