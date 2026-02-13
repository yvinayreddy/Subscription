const express = require('express');
const router = express.Router();
const {login,register}=require('../controller/user.controller');
const { bindUserId, protect } = require('../middlewares/user.middleware');

router.post('/login',login);
router.post('/register',register);

router.post('/:userId/profile', bindUserId, protect);
router.post('/:userId/posts', bindUserId, protect);

module.exports = router;
