const express = require('express');
const { body } = require('express-validator');
const adminAuth = require('../middleware/adminAuth');
const { registerToEvent, listRegistrations } = require('../controllers/registrationController');

const router = express.Router();

router.post(
  '/:id/registrations',
  [
    body('name').isString().trim().notEmpty(),
    body('email').isEmail().normalizeEmail()
  ],
  registerToEvent
);

router.get('/:id/registrations', adminAuth, listRegistrations);

module.exports = router;
