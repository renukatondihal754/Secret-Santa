# Secret-Santa

# Secret Santa Assignment Application

This application helps you manage Secret Santa assignments efficiently. It allows you to:

- Upload and import an **Employee List** (Excel file).
- Upload and import **Previous Year’s Assignments** (Excel file).
- Generate new Secret Santa assignments either:
  - Using the uploaded files, or
  - Directly from the data already stored in the backend database (no need to upload files again).

You can upload Excel files for employee lists and previous assignments, import the data into a backend database, and then generate new Secret Santa assignments that respect past assignments to avoid repetition. The app also displays generated assignments in a clear table format.

---

## How to Use

1. **Upload and Import Employee List**

   - Click **Choose File** under "Upload Employee List Excel" and select your employee Excel file.
   - Click **Import Employees** to upload the file and save employee data to the backend.
   - You will receive a success alert or error if the import fails.

2. **Upload and Import Previous Assignments**

   - Click **Choose File** under "Upload Last Year's Assignments Excel" and select your previous assignments Excel file.
   - Click **Import Previous Assignments** to upload the file and save previous assignment data to the backend.
   - You will get a confirmation alert or an error message.

3. **Generate Secret Santa Assignments**

   - **Option A: Generate using files**  
     Upload Employee List and Previous Assignments files again (optional), then click **Generate Assignments**.  
     Assignments will be generated based on uploaded files and displayed below.

   - **Option B: Generate from stored data**  
     Once data is imported into the database, you do **not** need to upload files again.  
     Simply click **Generate Assignments from Stored Data** to generate new assignments from existing backend data.

4. **View Assignments**

   - The generated assignments display in a table showing:  
     Employee Name and Email, Secret Santa Child’s Name and Email.

---

## Running the Application Locally

### Prerequisites

- Node.js and npm installed
- MySQL installed and running
- Backend API server ready (Node.js/Express)
- React frontend setup

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/secretsanta.git
   cd secretsanta

2. **Install frontend dependience and start**
  cd frontend
  npm install
  npm start

The React app will run at http://localhost:3000.

3. **Install backend dependencies and start**
   cd ../backend
  npm install
  npm start
Backend API will run at http://localhost:5000.

4.**Configure database connection**
  Update backend config file (e.g., .env) with your MySQL credentials:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=secretsanta_db

5.**Create the MySQL database and tables**
  CREATE DATABASE secretsanta_db;
    USE secretsanta_db;
    
    CREATE TABLE employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE
    );
    
    CREATE TABLE previous_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        assigned_to_id INT NOT NULL,
        FOREIGN KEY (employee_id) REFERENCES employees(id),
        FOREIGN KEY (assigned_to_id) REFERENCES employees(id)
    );
    
    CREATE TABLE assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        assigned_to_id INT NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id),
        FOREIGN KEY (assigned_to_id) REFERENCES employees(id)
    );


  ### Notes 
  After importing employee and previous assignments data once, you do not need to upload files again every time you want to generate new assignments.
  Use the Generate Assignments from Stored Data feature to generate assignments from existing database records.
  Ensure backend server is running and accessible at http://localhost:5000.
  The frontend React app should point to the correct backend API URLs.

  ### Troubleshooting

  Validate Excel file formats before upload.
  Confirm backend server is running without errors.
  Check browser console and backend logs for detailed error information.
  Ensure MySQL database and tables are correctly created.




