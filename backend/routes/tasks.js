const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation rules
const taskValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title must be less than 100 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    body('deadline')
        .isISO8601()
        .withMessage('Invalid date format'),
    body('priority')
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high')
];

// Routes
router.use(auth); // Protect all task routes

router.post('/', taskValidation, validate, taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.patch('/:id', taskValidation, validate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
