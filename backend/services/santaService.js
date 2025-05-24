function assignSecretSantas(employees, previousPairs, maxAttempts = 1000) {
  const previousSet = new Set(
    previousPairs.map(p => `${p.employee_email}-${p.child_email}`)
  );

  if (employees.length < 2) {
    throw new Error('At least two employees required');
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Shuffle employees to get a different assignment order each try
    const shuffledChildren = shuffleArray(employees);

    const assignments = [];
    const assignedChildrenEmails = new Set();

    let valid = true;

    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];

      // Find next valid child in shuffledChildren who is:
      // - not themselves
      // - not assigned yet
      // - not assigned same child as last year
      let assignedChild = null;

      for (const child of shuffledChildren) {
        if (
          child.employee_email !== emp.employee_email &&
          !assignedChildrenEmails.has(child.employee_email) &&
          !previousSet.has(`${emp.employee_email}-${child.employee_email}`)
        ) {
          assignedChild = child;
          break;
        }
      }

      if (!assignedChild) {
        valid = false;
        break; // Fail this attempt
      }

      assignments.push({
        employee_name: emp.employee_name,
        employee_email: emp.employee_email,
        child_name: assignedChild.employee_name,
        child_email: assignedChild.employee_email,
      });

      assignedChildrenEmails.add(assignedChild.employee_email);
    }

    if (valid) {
      return assignments;
    }
  }

  throw new Error('Failed to generate valid assignments after multiple attempts');
}

function shuffleArray(arr) {
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = { assignSecretSantas };
