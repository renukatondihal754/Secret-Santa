// controllers/importController.js
const { parseExcelToJSON } = require('../utils/excelParser');
const pool = require('../models/db');

async function importEmployees(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Employee file required' });
    }

    const employeesData = parseExcelToJSON(req.file.buffer);

    for (const row of employeesData) {
      const name = row.Employee_Name;
      const email = row.Employee_EmailID;
      if (!name || !email) continue;

      // Upsert employee (insert or update)
      await pool.query(
        `INSERT INTO employees (name, email) VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name`,
        [name, email]
      );
    }

    res.json({ success: true, message: 'Employees imported' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { importEmployees };
