// routes/importRoutes.js
const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { importEmployees } = require('../controllers/importController');

const router = express.Router();

router.post('/import/employees', upload.single('employeeFile'), importEmployees);

// Similarly add route for previous assignments

module.exports = router;
    