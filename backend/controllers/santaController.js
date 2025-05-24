const { parseExcelToJSON } = require('../utils/excelParser');
const { assignSecretSantas } = require('../services/santaService');
const pool = require('../models/db');

async function handleAssignments(req, res) {
  try {
    const rawEmployeeData = parseExcelToJSON('./data/Employee-List.xlsx');
    const rawPreviousData = parseExcelToJSON('./data/Secret-Santa-Game-Result-2023.xlsx');

    // Normalize keys to expected format
    const employeeData = rawEmployeeData.map(row => ({
      employee_name: row.Employee_Name,
      employee_email: row.Employee_EmailID,
    }));

    const previousData = rawPreviousData.map(row => ({
      employee_email: row.Employee_EmailID,
      child_email: row.Secret_Child_EmailID,
    }));

    console.log("EMPLOYEE DATA:", employeeData);
    console.log("PREVIOUS DATA:", previousData);

    const assignments = assignSecretSantas(employeeData, previousData);

    for (const a of assignments) {
      await pool.query(
        'INSERT INTO assignments (employee_email, child_email) VALUES ($1, $2)',
        [a.employee_email, a.child_email]
      );
    }

    res.json({ success: true, assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleAssignments };
