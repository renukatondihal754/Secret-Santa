// const express = require('express');
// const router = express.Router();
// const { handleAssignments } = require('../controllers/santaController');

// router.get('/assign', handleAssignments);

// module.exports = router;


const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  handleAssignments,
  importEmployees,
  importPreviousAssignments
} = require('../controllers/santaController');

const router = express.Router();

// Existing assignment route
router.post('/assign', upload.fields([
  { name: 'employeeFile', maxCount: 1 },
  { name: 'previousFile', maxCount: 1 }
]), handleAssignments);

// ✅ New route to import employees
router.post('/import-employees', upload.single('employeeFile'), importEmployees);

// ✅ New route to import previous year assignments
router.post('/import-previous', upload.single('previousFile'), importPreviousAssignments);

module.exports = router;


