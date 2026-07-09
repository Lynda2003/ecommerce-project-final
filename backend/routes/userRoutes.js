const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getUserProfile, updateUserProfile, getAllUsers, deleteUser
} = require('../controllers/userController');

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/').get(protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;