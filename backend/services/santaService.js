function assignSecretSantas(employees, previousPairs) {
  // Set of "santaEmail-childEmail" to track past pairings
  const previousSet = new Set(
    previousPairs.map(p => `${p.employee_email}-${p.child_email}`)
  );

  // Clone the array of employees to represent unassigned children
  let availableChildren = [...employees];

  const assignments = [];

  for (const emp of employees) {
    const possible = availableChildren.filter(child =>
      child.employee_email !== emp.employee_email && // not themselves
      !previousSet.has(`${emp.employee_email}-${child.employee_email}`) // not same as previous year
    );

    if (possible.length === 0) {
      throw new Error(`No valid assignment for ${emp.employee_email}`);
    }

    const selected = possible[Math.floor(Math.random() * possible.length)];

    assignments.push({
      employee_name: emp.employee_name,
      employee_email: emp.employee_email,
      child_name: selected.employee_name,
      child_email: selected.employee_email
    });

    // Remove selected child so they're not assigned twice
    availableChildren = availableChildren.filter(c => c.employee_email !== selected.employee_email);
  }

  return assignments;
}

module.exports = { assignSecretSantas };
