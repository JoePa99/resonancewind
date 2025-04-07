import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GeographicChart = ({ data }) => {
  if (!data || !data.regions) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No geographic data available
        </Typography>
      </Paper>
    );
  }

  // Sort regions by percentage (descending)
  const sortedRegions = Object.entries(data.regions)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  const chartData = {
    labels: Object.keys(sortedRegions),
    datasets: [
      {
        label: 'Geographic Distribution',
        data: Object.values(sortedRegions),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage (%)',
        },
      },
    },
  };

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="subtitle1" gutterBottom align="center">
        Geographic Distribution
      </Typography>
      <Box sx={{ height: 320 }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default GeographicChart;
