import React, { useEffect, useState } from 'react'


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
        <h2>Employee List</h2>
        <ul>
        {employees.map((emp) => (
            <li key={emp.employee_id}>
            {emp.name} - {emp.email} - {emp.phone_number} - {emp.salary}
            </li>
        ))}
        </ul>
        <button onClick={sendTestData}>Send Test Data</button>
    </div>
    );    
}

export default Employee