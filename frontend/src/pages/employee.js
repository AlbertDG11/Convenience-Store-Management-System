import React, { useEffect, useState } from 'react'
import {
    Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  } from '@mui/material';


function sendTestData() {
    fetch('http://localhost:8000/api/employee/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            phone_number: "1234567890",
            salary: 50000,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Server responded:", data);
        alert("Server response: " + data.message);
    })
    .catch((err) => {
        console.error("Error sending data:", err);
    });
}

function add() {
    return(<div></div>)
}


function Employee(props) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true); // 加载状态
    const [error, setError] = useState(null);     // 错误信息
    
    useEffect(() => {
        //fetch('/api/employee/list/')
        fetch('http://localhost:8000/api/employee/list/')
        .then((response) => {
        console.log("After aksing")
        console.log("After aksing2")
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
        })
        .then((data) => {
            console.log("Received:", data);
            setEmployees(data);
            setLoading(false);
        })
        .catch((err) => {
        setError(err.message);
        setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading employees...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
    <div>
    {/*<div>
        <h2>Employee List</h2>
        <ul>
        {employees.map((emp) => (
            <li key={emp.employee_id}>
            {emp.name} - {emp.email} - {emp.phone_number} - {emp.salary}
            - {emp.addresses} - {emp.role} - {emp.sales_target}
            - {emp.purchase_section} - {emp.management_level}
            - {emp.management}
            <button>Update</button>
            <button>Delete</button>
            </li>
        ))}
        <button>Add</button>
        </ul>
        <button onClick={sendTestData}>Send Test Data</button>
    </div>*/}
    
    <Box sx={{
    minHeight: '100vh',
    backgroundImage: 'url(https://source.unsplash.com/random/1600x900?business)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    py: 6}}>
    <Box
    sx={{
      maxWidth: '90%',
      mx: 'auto',
      backgroundColor: 'rgba(252, 249, 249, 0.8)',
      borderRadius: 4,
      p: 4,
      backdropFilter: 'blur(5px)',
    }}
    >

<Typography variant="h4" gutterBottom>
        Employee List
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Salary</strong></TableCell>
              <TableCell><strong>Addresses</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Sales Target</strong></TableCell>
              <TableCell><strong>Purchase Section</strong></TableCell>
              <TableCell><strong>Management Level</strong></TableCell>
              <TableCell><strong>Management</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.employee_id}>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.phone_number}</TableCell>
                <TableCell>${emp.salary}</TableCell>
                <TableCell>{emp.addresses}</TableCell>
                <TableCell>
                  <Chip label={emp.role} size="small" color="primary" />
                </TableCell>
                <TableCell>{emp.sales_target || '-'}</TableCell>
                <TableCell>{emp.purchase_section || '-'}</TableCell>
                <TableCell>{emp.management_level || '-'}</TableCell>
                <TableCell>{emp.management || '-'}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined">Update</Button>{' '}
                  <Button size="small" variant="outlined" color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" >Add</Button>
        <Button variant="outlined" onClick={sendTestData}>Send Test Data</Button>
      </Box>
    </Box>
    </Box>
    </div>);    
}

export default Employee