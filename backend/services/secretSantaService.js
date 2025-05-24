const fs = require('fs');
const { parse } = require('csv-parse/sync');

/**
 * Parse employee CSV content
 * @param {Buffer} fileBuffer
 * @returns {Array} of employees [{ name, email }]
 */
function parseEmployeesCSV(fileBuffer) {
  const records = parse(fileBuffer.toString(), {
    columns: true,
    skip_empty_lines: true,
  });
  return records.map(row => ({
    name: row.Employee_Name.trim(),
    email: row.Employee_EmailID.trim().toLowerCase(),
  }));
}

/**
 * Parse previous assignments CSV content
 * @param {Buffer} fileBuffer
 * @returns {Array} of previous assignments [{ employeeEmail, childEmail }]
 */
function parsePreviousAssignmentsCSV(fileBuffer) {
  const records = parse(fileBuffer.toString(), {
    columns: true,
    skip_empty_lines: true,
  });
  return records.map(row => ({
    employeeEmail: row.Employee_EmailID.trim().toLowerCase(),
    childEmail: row.Secret_Child_EmailID.trim().toLowerCase(),
  }));
}

/**
 * Generate Secret Santa assignments
 * Constraints:
 * - No employee assigned themselves
 * - No same assignment as previous year
 * - One-to-one mapping
 * 
 * @param {Array} employees Array of { name, email }
 * @param {Array} previousAssignments Array of { employeeEmail, childEmail }
 * @returns {Array} assignments [{ employee_name, employee_email, child_name, child_email }]
 */
function generateAssignments(employees, previousAssignments) {
  // Create a map for quick lookup of employees by email
  const emailToEmployee = new Map(employees.map(e => [e.email, e]));

  // Set of forbidden assignments from previous year
  const forbidden = new Set(
    previousAssignments.map(pa => `${pa.employeeEmail}->${pa.childEmail}`)
  );

  // Shuffle helper
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Try to find valid assignments using backtracking
  function backtrack(assigned, remainingEmployees, remainingChildren) {
    if (remainingEmployees.length === 0) {
      return assigned; // all assigned successfully
    }
    const employee = remainingEmployees[0];

    for (let i = 0; i < remainingChildren.length; i++) {
      const child = remainingChildren[i];

      if (
        child.email !== employee.email && // no self assignment
        !forbidden.has(`${employee.email}->${child.email}`) && // no previous assignment repeat
        !assigned.some(a => a.child_email === child.email) // child not assigned yet
      ) {
        // Assign this child to employee
        const newAssigned = assigned.concat({
          employee_name: employee.name,
          employee_email: employee.email,
          child_name: child.name,
          child_email: child.email,
        });

        // Recurse with remaining employees and children
        const result = backtrack(
          newAssigned,
          remainingEmployees.slice(1),
          remainingChildren.filter((_, idx) => idx !== i)
        );

        if (result) {
          return result;
        }
      }
    }
    // No valid assignment for this employee found
    return null;
  }

  // Shuffle employees and children for randomness
  const shuffledEmployees = [...employees];
  const shuffledChildren = [...employees];
  shuffle(shuffledEmployees);
  shuffle(shuffledChildren);

  const assignments = backtrack([], shuffledEmployees, shuffledChildren);

  if (!assignments) {
    throw new Error('No valid Secret Santa assignment possible with given constraints.');
  }

  return assignments;
}

module.exports = {
  parseEmployeesCSV,
  parsePreviousAssignmentsCSV,
  generateAssignments,
};
