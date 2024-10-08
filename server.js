// server.js

let students = [];
let editingStudentIndex = null; // Track which student is being edited

// Function to render students in the table and in the dropdown
function renderStudents() {
  const tableBody = document.getElementById('studentTableBody');
  const studentSelect = document.getElementById('studentSelect');
  tableBody.innerHTML = ''; // Clear previous rows
  studentSelect.innerHTML = '<option value="">Select Student</option>'; // Reset dropdown

  students.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.rollNo}</td>
      <td>${student.name}</td>
      <td>${getAttendanceHistory(student.attendance)}</td>
      <td>
        <button onclick="editStudent(${index})">Edit</button>
        <button onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);

    // Add student to the dropdown for attendance marking
    const option = document.createElement('option');
    option.value = index;
    option.text = `${student.name} (Roll No: ${student.rollNo})`;
    studentSelect.appendChild(option);
  });
}

// Function to get formatted attendance history
function getAttendanceHistory(attendance) {
  return attendance.map(record => `${record.date}: ${record.status}`).join(', ');
}

// Function to add a student
document.getElementById('studentForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const rollNo = document.getElementById('rollNo').value;

  if (editingStudentIndex === null) {
    const newStudent = { name, rollNo, attendance: [] };
    students.push(newStudent); // Add new student
  } else {
    // Update student details
    students[editingStudentIndex].name = name;
    students[editingStudentIndex].rollNo = rollNo;
    editingStudentIndex = null; // Reset after updating
    document.getElementById('updateBtn').style.display = 'none'; // Hide the Update button
  }

  renderStudents(); // Update the table
  this.reset(); // Clear the form
  document.getElementById('studentForm').querySelector('button[type="submit"]').style.display = 'inline'; // Show the Add button
});

// Function to edit student details
function editStudent(index) {
  editingStudentIndex = index;
  const student = students[index];

  document.getElementById('name').value = student.name;
  document.getElementById('rollNo').value = student.rollNo;

  document.getElementById('studentForm').querySelector('button[type="submit"]').style.display = 'none'; // Hide the Add button
  document.getElementById('updateBtn').style.display = 'inline'; // Show the Update button
}

// Function to mark attendance
document.getElementById('attendanceForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const studentIndex = document.getElementById('studentSelect').value;
  const attendanceDate = document.getElementById('attendanceDate').value;
  const attendanceStatus = document.getElementById('attendanceStatus').value;

  if (!studentIndex) {
    alert('Please select a student');
    return;
  }

  const student = students[studentIndex];
  student.attendance.push({ date: attendanceDate, status: attendanceStatus });
  renderStudents(); // Refresh the table
  this.reset(); // Clear the form
});

// Function to delete a student
function deleteStudent(index) {
  students.splice(index, 1); // Remove student from the array
  renderStudents(); // Update the table
}

// Add functionality to update the student
document.getElementById('updateBtn').addEventListener('click', function() {
  document.getElementById('studentForm').submit();
});
