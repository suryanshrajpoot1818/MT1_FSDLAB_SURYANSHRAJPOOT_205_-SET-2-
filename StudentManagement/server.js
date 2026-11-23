const express = require('express');

const app = express();

app.use(express.json());

let students = [
    {
        id: 201,
        rollNumber: "CSE2401",
        name: "Aarav Sharma",
        branch: "CSE",
        semester: 3,
        email: "aarav@example.com"
    },
    {
        id: 202,
        rollNumber: "ECE2402",
        name: "Diya Verma",
        branch: "ECE",
        semester: 3,
        email: "diya@example.com"
    },
    {
        id: 203,
        rollNumber: "CSE2403",
        name: "Kabir Singh",
        branch: "CSE",
        semester: 3,
        email: "kabir@example.com"
    }
];

// GET all students
app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});

// POST a new student
app.post('/api/students', (req, res) => {
    const { rollNumber, name, branch, semester, email } = req.body;

    if (!rollNumber || !name || !branch ||
        !Number.isInteger(semester) || semester <= 0 ||
        !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            message: "Please provide valid student details"
        });
    }

    const exists = students.find(
        student => student.rollNumber.toLowerCase() === rollNumber.trim().toLowerCase()
    );

    if (exists) {
        return res.status(400).json({
            message: "Roll number already exists"
        });
    }

    const newStudent = {
        id: Math.max(200, ...students.map(student => student.id)) + 1,
        rollNumber: rollNumber.trim(),
        name: name.trim(),
        branch: branch.trim(),
        semester,
        email: email.trim()
    };

    students.push(newStudent);

    res.status(201).json(newStudent);
});

// FILTER students by branch
app.get('/api/students/filter', (req, res) => {
    const branch = req.query.branch;

    if (!branch) {
        return res.status(400).json({
            message: "Branch query parameter is required"
        });
    }

    const result = students.filter(
        student => student.branch.toLowerCase() === branch.toLowerCase()
    );

    res.status(200).json(result);
});

// GET student by ID
app.get('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});

// PUT update student
app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { rollNumber, name, branch, semester, email } = req.body;

    if (!rollNumber || !name || !branch ||
        !Number.isInteger(semester) || semester <= 0 ||
        !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            message: "Please provide valid student details"
        });
    }

    const duplicate = students.find(
        (s, i) => i !== index &&
        s.rollNumber.toLowerCase() === rollNumber.trim().toLowerCase()
    );

    if (duplicate) {
        return res.status(400).json({
            message: "Roll number already exists"
        });
    }

    students[index] = {
        id,
        rollNumber: rollNumber.trim(),
        name: name.trim(),
        branch: branch.trim(),
        semester,
        email: email.trim()
    };

    res.status(200).json(students[index]);
});

// DELETE student
app.delete('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully"
    });
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});