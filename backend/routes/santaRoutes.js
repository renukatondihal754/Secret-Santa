const express = require('express');
const router = express.Router();
const { handleAssignments } = require('../controllers/santaController');

// router.get('/assign', handleAssignments);
router.post('/assign', handleAssignments);

module.exports = router;
