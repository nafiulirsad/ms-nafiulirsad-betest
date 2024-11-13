const express = require('express');
const { jwtGuard } = require('../middleware/jwtMiddleware');
const UserController = require('../controllers/userController');
const router = express.Router();

router.get('/', jwtGuard, UserController.getAllUsers); 
router.post('/', jwtGuard, UserController.createUser);
router.get('/userName/:userName', jwtGuard, UserController.getUserByUserName);
router.get('/accountNumber/:accountNumber', jwtGuard, UserController.getUserByAccountNumber);
router.get('/emailAddress/:emailAddress', jwtGuard, UserController.getUserByEmailAddress);
router.get('/identityNumber/:identityNumber', jwtGuard, UserController.getUserByIdentityNumber);
router.put('/:userId', jwtGuard, UserController.updateUser);
router.delete('/:userId', jwtGuard, UserController.deleteUser);

module.exports = router;