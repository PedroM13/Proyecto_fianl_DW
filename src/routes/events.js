const express = require('express');
const { body } = require('express-validator');
const adminAuth = require('../middleware/adminAuth');
const {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const router = express.Router();

// Public
router.get('/', listEvents);
router.get('/:id', getEvent);

// Admin routes
const validateEvent = [
  body('title').isString().trim().notEmpty(),
  body('description').optional().isString(),
  body('date').isString().trim().notEmpty(),
  body('time').isString().trim().notEmpty(),
  body('location').isString().trim().notEmpty(),
  body('capacity').optional().isInt({ min: 0 })
];

router.post('/', adminAuth, validateEvent, createEvent);
router.put('/:id', adminAuth, validateEvent, updateEvent);
router.delete('/:id', adminAuth, deleteEvent);

module.exports = router;
