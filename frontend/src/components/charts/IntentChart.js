import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const IntentChart = ({ data }) => {
  if (!data || !data.categories) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No intent data available
        </Typography>
      </Paper>
    );
  }

  // Define colors for each intent category
  const intentColors = {
    awareness: 'rgba(33, 150, 243, 0.8)', // Blue
    consideration: 'rgba(156, 39, 176, 0.8)', // Purple
    conversion: 'rgba(76, 175, 80, 0.8)', // Green
  };

  const chartData = {
    labels: Object.keys(data.categories).map(
      key => key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [
      {
        data: Object.values(data.categories),
        backgroundColor: Object.keys(data.categories).map(key => intentColors[key]),
        borderColor: Object.keys(data.categories).map(key => intentColors[key].replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    },
    cutout: '50%',
  };

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="subtitle1" gutterBottom align="center">
        Intent Signal Distribution
      </Typography>
      <Box sx={{ height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ width: '80%', height: '80%' }}>
          <Doughnut data={chartData} options={options} />
        </Box>
      </Box>
    </Paper>
  );
};

export default IntentChart;
