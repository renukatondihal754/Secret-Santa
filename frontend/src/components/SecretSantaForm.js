import React, { useState } from 'react';
import axios from 'axios';
import '../styles/santastyle.css'


function SecretSantaForm() {
  const [employeeFile, setEmployeeFile] = useState(null);
  const [previousFile, setPreviousFile] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const handleGenerate = async () => {
    if (!employeeFile || !previousFile) {
      alert('Please upload both files');
      return;
    }

    const formData = new FormData();
    formData.append('employeeFile', employeeFile);
    formData.append('previousFile', previousFile);

    try {
      const res = await axios.post('http://localhost:5000/api/assign', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAssignments(res.data.assignments);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      

      <div className="container">
        <h2>Secret Santa Assignment</h2>

        <div className="mb-3">
          <label>Upload Employee List Excel</label>
          <input type="file" onChange={(e) => setEmployeeFile(e.target.files[0])} />
        </div>

        <div className="mb-3">
          <label>Upload Last Year's Assignments Excel</label>
          <input type="file" onChange={(e) => setPreviousFile(e.target.files[0])} />
        </div>

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
    </>
  );
}

export default SecretSantaForm;
