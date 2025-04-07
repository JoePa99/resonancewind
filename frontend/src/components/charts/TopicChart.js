import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const TopicChart = ({ data }) => {
  if (!data || !data.topics || data.topics.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No topic data available
        </Typography>
      </Paper>
    );
  }

  // Generate random colors for each topic
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360; // Use golden ratio to spread colors
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  };

  const backgroundColor = generateColors(data.topics.length);
  const borderColor = backgroundColor.map(color => color.replace('60%', '70%'));

  const chartData = {
    labels: data.topics.map(topic => topic.name),
    datasets: [
      {
        data: data.topics.map(topic => topic.prevalence),
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
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

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="subtitle1" gutterBottom align="center">
        Topic Distribution
      </Typography>
      <Box sx={{ height: 320 }}>
        <Pie data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default TopicChart;
