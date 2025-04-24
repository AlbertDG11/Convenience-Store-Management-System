import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box, Typography, Button, Grid, TextField, Stack, Paper } from '@mui/material';


function DailyReportChart({ data }) {
  return (
    <LineChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="total_amount" stroke="#8884d8" name="Sales" yAxisId="left" />
      <Line type="monotone" dataKey="order_count" stroke="#82ca9d" name="Orders" yAxisId="right"/>
    </LineChart>
  );
}


function SalesReportDashboard() {
  const [reportType, setReportType] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [startDate, setStartDate] = useState('2025-04-10');
  const [endDate, setEndDate] = useState('2025-04-17');
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8000/report/sales/', {
        params: { start_date: startDate, end_date: endDate, type: reportType }
      })
      .then(res => setData(res.data))
      .catch(err => console.error(err));
    }, [reportType, startDate, endDate]);
  
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Box
        sx={{
          maxWidth: '95%',
          mx: 'auto',
          backgroundColor: '#fff',
          borderRadius: 4,
          p: 4,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          Sales Report
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 2 }}>
          {['daily', 'weekly', 'monthly'].map((type) => (
            <Button
              key={type}
              variant={reportType === type ? 'contained' : 'outlined'}
              onClick={() => setReportType(type)}
            >
              {type.toUpperCase()}
            </Button>
          ))}
        </Stack>

        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Grid item>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Paper elevation={2} sx={{ p: 2 }}>
          <DailyReportChart data={data} />
        </Paper>
      </Box>
    </Box>
  );
}

export default SalesReportDashboard;