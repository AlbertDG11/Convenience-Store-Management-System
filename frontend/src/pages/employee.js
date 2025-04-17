import React, { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
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
      maxWidth: 1000,
      mx: 'auto',
      backgroundColor: 'rgba(207, 24, 24, 0.8)',
      borderRadius: 4,
      p: 4,
      backdropFilter: 'blur(5px)',
    }}
    >

      <Typography variant="h4" gutterBottom>
        Employee List
      </Typography>

      <Grid container spacing={3}>
        {employees.map((emp) => (
          <Grid item xs={12} key={emp.employee_id}>
            <Card elevation={3}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography><strong>Name:</strong> {emp.name}</Typography>
                    <Typography><strong>Email:</strong> {emp.email}</Typography>
                    <Typography><strong>Phone:</strong> {emp.phone_number}</Typography>
                    <Typography><strong>Salary:</strong> ${emp.salary}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography><strong>Addresses:</strong> {emp.addresses}</Typography>
                    <Typography><strong>Role:</strong> <Chip label={emp.role} color="primary" size="small" /></Typography>
                    {emp.sales_target && (
                      <Typography><strong>Sales Target:</strong> {emp.sales_target}</Typography>
                    )}
                    {emp.purchase_section && (
                      <Typography><strong>Purchase Section:</strong> {emp.purchase_section}</Typography>
                    )}
                    {emp.management_level && (
                      <Typography><strong>Management Level:</strong> {emp.management_level}</Typography>
                    )}
                    {emp.management && (
                      <Typography><strong>Management:</strong> {emp.management}</Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined">Update</Button>
                <Button size="small" color="error" variant="outlined">Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained">Add</Button>
        <Button variant="outlined" onClick={sendTestData}>Send Test Data</Button>
      </Box>
    </Box>
    </Box>
    </div>);    
}

export default Employee