import React, { useState } from 'react';
import axios from 'axios';
import '../styles/santastyle.css'


function SecretSantaForm() {
  const [employeeFile, setEmployeeFile] = useState(null);
  const [previousFile, setPreviousFile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);


  // Existing generate assignments
  const handleGenerate = async () => {
  setLoading(true);
  const formData = new FormData();

  // Append files only if present (optional upload)
  if (employeeFile) formData.append('employeeFile', employeeFile);
  if (previousFile) formData.append('previousFile', previousFile);

  try {
    const res = await axios.post('http://localhost:5000/api/assign', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setAssignments(res.data.assignments);

    // Clear files only if you want, or keep for next import
    setEmployeeFile(null);
    setPreviousFile(null);
  } catch (err) {
    alert('Error: ' + (err.response?.data?.error || err.message));
  }
  setLoading(false);
};


  // New: Import employees only
  const handleImportEmployees = async () => {
    if (!employeeFile) {
      alert('Please upload employee file');
      return;
    }
    const formData = new FormData();
    formData.append('employeeFile', employeeFile);
    try {
      await axios.post('http://localhost:5000/api/import-employees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Employees imported successfully');
    } catch (err) {
      alert('Error importing employees: ' + (err.response?.data?.error || err.message));
    }
  };

  // New: Import previous assignments only
  const handleImportPrevious = async () => {
    if (!previousFile) {
      alert('Please upload previous assignments file');
      return;
    }
    const formData = new FormData();
    formData.append('previousFile', previousFile);
    try {
      await axios.post('http://localhost:5000/api/import-previous', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Previous assignments imported successfully');
    } catch (err) {
      alert('Error importing previous assignments: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container">
      <h2>Secret Santa Assignment</h2>

      <div className="mb-3">
        <label>Upload Employee List Excel</label>
        <input type="file" onChange={(e) => setEmployeeFile(e.target.files[0])} />
      </div>

      <button className="btn" onClick={handleImportEmployees}>
        Import Employees
      </button>

      <div className="mb-3" style={{ marginTop: '20px' }}>
        <label>Upload Last Year's Assignments Excel</label>
        <input type="file" onChange={(e) => setPreviousFile(e.target.files[0])} />
      </div>

      <button className="btn" onClick={handleImportPrevious}>
        Import Previous Assignments
      </button>

      <hr style={{ margin: '30px 0' }} />

      <button className="btn" onClick={handleGenerate}>
        Generate Assignments
      </button>

      {assignments.length > 0 && (
        <div className="assignments-container">
          <h4>New Assignments</h4>
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee Email</th>
                <th>Secret Child Name</th>
                <th>Secret Child Email</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, index) => (
                <tr key={index}>
                  <td>{a.employee_name}</td>
                  <td>{a.employee_email}</td>
                  <td>{a.child_name}</td>
                  <td>{a.child_email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


export default SecretSantaForm;
