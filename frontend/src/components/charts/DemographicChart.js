import React, { useState } from 'react';
import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DemographicChart = ({ data }) => {
  const [chartType, setChartType] = useState('age');

  if (!data || !data.age_groups || !data.gender || !data.income_levels) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No demographic data available
        </Typography>
      </Paper>
    );
  }

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Generate colors for pie charts
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360; // Use golden ratio to spread colors
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  };

  // Prepare data based on selected chart type
  let chartData = {};
  let chartOptions = {};
  let ChartComponent = null;

  if (chartType === 'age') {
    const backgroundColor = generateColors(Object.keys(data.age_groups).length);
    chartData = {
      labels: Object.keys(data.age_groups),
      datasets: [
        {
          data: Object.values(data.age_groups),
          backgroundColor,
          borderColor: backgroundColor.map(color => color.replace('60%', '70%')),
          borderWidth: 1,
        },
      ],
    };
    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 15,
            padding: 10,
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
    };
    ChartComponent = Pie;
  } else if (chartType === 'gender') {
    const backgroundColor = ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)', 'rgba(255, 206, 86, 0.8)'];
    chartData = {
      labels: Object.keys(data.gender),
      datasets: [
        {
          data: Object.values(data.gender),
          backgroundColor,
          borderColor: backgroundColor.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        },
      ],
    };
    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 15,
            padding: 10,
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
    };
    ChartComponent = Pie;
  } else if (chartType === 'income') {
    chartData = {
      labels: Object.keys(data.income_levels),
      datasets: [
        {
          label: 'Income Distribution',
          data: Object.values(data.income_levels),
          backgroundColor: [
            'rgba(255, 152, 0, 0.8)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(156, 39, 176, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
    chartOptions = {
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
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Percentage (%)',
          },
        },
      },
    };
    ChartComponent = Bar;
  }

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">
          Demographic Distribution
        </Typography>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="age">Age</ToggleButton>
          <ToggleButton value="gender">Gender</ToggleButton>
          <ToggleButton value="income">Income</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ height: 300 }}>
        {ChartComponent && <ChartComponent data={chartData} options={chartOptions} />}
      </Box>
    </Paper>
  );
};

export default DemographicChart;
