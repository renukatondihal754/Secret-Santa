const { parseExcelToJSON } = require('../utils/excelParser');
const { assignSecretSantas } = require('../services/santaService');
const pool = require('../models/db');

async function handleAssignments(req, res) {
  try {
    let employeeData, previousData;

    if (req.files && req.files['employeeFile'] && req.files['previousFile']) {
      // Use uploaded files if provided
      const employeeBuffer = req.files['employeeFile'][0].buffer;
      const previousBuffer = req.files['previousFile'][0].buffer;

      const rawEmployeeData = parseExcelToJSON(employeeBuffer);
      const rawPreviousData = parseExcelToJSON(previousBuffer);

      employeeData = rawEmployeeData.map(row => ({
        employee_name: row.Employee_Name,
        employee_email: row.Employee_EmailID,
      }));

      previousData = rawPreviousData.map(row => ({
        employee_email: row.Employee_EmailID,
        child_email: row.Secret_Child_EmailID,
      }));
    } else {
      // Otherwise, fetch from database
      const employeesResult = await pool.query('SELECT name AS employee_name, email AS employee_email FROM employees');
      const previousResult = await pool.query('SELECT employee_email, child_email FROM previous_assignments');

      employeeData = employeesResult.rows;
      previousData = previousResult.rows;
    }

    // Generate assignments using employeeData and previousData
    const assignments = assignSecretSantas(employeeData, previousData);

    // Store assignments in DB (optional: clear old assignments first)
    for (const a of assignments) {
      await pool.query(
        'INSERT INTO assignments (employee_email, child_email, assigned_at) VALUES ($1, $2, $3)',
        [a.employee_email, a.child_email, new Date()]
      );
    }

    res.json({ success: true, assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



// New import functions

async function importEmployees(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Employee file required' });

    const employees = parseExcelToJSON(req.file.buffer);

    for (const row of employees) {
      const name = row.Employee_Name;
      const email = row.Employee_EmailID;
      if (!name || !email) continue;

      await pool.query(
        `INSERT INTO employees (name, email) VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name`,
        [name, email]
      );
    }

    res.json({ success: true, message: 'Employees imported' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function importPreviousAssignments(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Previous assignments file required' });

    const prevAssignments = parseExcelToJSON(req.file.buffer);

    for (const row of prevAssignments) {
      const employee_email = row.Employee_EmailID;
      const child_email = row.Secret_Child_EmailID;
      if (!employee_email || !child_email) continue;

      await pool.query(
        `INSERT INTO previous_assignments (employee_email, child_email)
         VALUES ($1, $2)
         ON CONFLICT (employee_email) DO UPDATE SET child_email = EXCLUDED.child_email`,
        [employee_email, child_email]
      );
    }

    res.json({ success: true, message: 'Previous assignments imported' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  handleAssignments,
  importEmployees,
  importPreviousAssignments,
};

// module.exports = { handleAssignments };
