const express = require('express');
const auth = require('../middleware/authorization');
const { createUser, login, verifyUser, updateUser, logout } = require('../controllers/user.Controller');

const userRouter = express.Router();

userRouter.post('/register', createUser);
userRouter.post('/login', login);
userRouter.get('/verify-user', auth, verifyUser);
userRouter.put('/update-user', auth, updateUser);
userRouter.post('/logout', logout);

module.exports = userRouter;