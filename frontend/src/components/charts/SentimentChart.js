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

const SentimentChart = ({ data }) => {
  if (!data || !data.distribution) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No sentiment data available
        </Typography>
      </Paper>
    );
  }

  const sentimentColors = {
    'Very Positive': 'rgba(76, 175, 80, 0.8)',
    'Positive': 'rgba(139, 195, 74, 0.8)',
    'Neutral': 'rgba(158, 158, 158, 0.8)',
    'Negative': 'rgba(255, 152, 0, 0.8)',
    'Very Negative': 'rgba(244, 67, 54, 0.8)',
  };

  // Sort sentiment categories in order from negative to positive
  const sentimentOrder = [
    'Very Negative',
    'Negative',
    'Neutral',
    'Positive',
    'Very Positive',
  ];

  const sortedDistribution = {};
  sentimentOrder.forEach(sentiment => {
    if (data.distribution[sentiment] !== undefined) {
      sortedDistribution[sentiment] = data.distribution[sentiment];
    }
  });

  const chartData = {
    labels: Object.keys(sortedDistribution),
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: Object.values(sortedDistribution),
        backgroundColor: Object.keys(sortedDistribution).map(key => sentimentColors[key]),
        borderWidth: 1,
      },
    ],
  };

  const options = {
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

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="subtitle1" gutterBottom align="center">
        Sentiment Distribution
      </Typography>
      <Box sx={{ height: 320 }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default SentimentChart;
