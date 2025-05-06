const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Helper to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Register Route
router.post('/register', [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be strong: 8+ chars, 1 uppercase, 1 number, 1 special char')
        .isLength({ min: 8 })
        .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
        .matches(/\d/).withMessage('Must contain a number')
        .matches(/[@$!%*?&]/).withMessage('Must contain a special character')
], validate, authController.register);

// Login Route
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
], validate, authController.login);

module.exports = router;
