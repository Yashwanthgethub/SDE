const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const passport = require('../passport');
const jwt = require('jsonwebtoken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/notifications', auth, authController.getNotifications);
router.patch('/notifications/:id/read', auth, authController.markNotificationRead);
router.get('/me', auth, authController.getMe);
router.put('/me', auth, authController.updateMe);
router.post('/change-password', auth, authController.changePassword);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Generate JWT and send to frontend
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/auth/google/success?token=${token}`);
  }
);

router.get('/users', auth, authController.listUsers);

module.exports = router; 