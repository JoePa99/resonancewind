import React from 'react';
import { Radar } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Box, Typography, useTheme } from '@mui/material';

// Register the required chart components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Define colors for up to 5 different brands
const brandColors = [
  { backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgb(54, 162, 235)' },
  { backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgb(255, 99, 132)' },
  { backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgb(75, 192, 192)' },
  { backgroundColor: 'rgba(255, 159, 64, 0.2)', borderColor: 'rgb(255, 159, 64)' },
  { backgroundColor: 'rgba(153, 102, 255, 0.2)', borderColor: 'rgb(153, 102, 255)' }
];

const SpiderChart = ({ brands }) => {
  const theme = useTheme();
  
  if (!brands || brands.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="body1">No brand data available</Typography>
      </Box>
    );
  }

  // Prepare data for the radar chart
  const labels = [
    'Conversational Depth', 
    'Community Spread', 
    'Emotional Intensity', 
    'Intent Signals', 
    'Advocacy Language'
  ];

  const datasets = brands.map((brand, index) => {
    const colorIndex = index % brandColors.length;
    return {
      label: brand.name,
      data: [
        brand.metrics.conversational_depth * 10,
        brand.metrics.community_spread * 10,
        brand.metrics.emotional_intensity * 10,
        brand.metrics.intent_signals * 10,
        brand.metrics.advocacy_language * 10
      ],
      backgroundColor: brandColors[colorIndex].backgroundColor,
      borderColor: brandColors[colorIndex].borderColor,
      borderWidth: 2,
      pointBackgroundColor: brandColors[colorIndex].borderColor,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: brandColors[colorIndex].borderColor
    };
  });

  const data = {
    labels,
    datasets
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 10,
        ticks: {
          stepSize: 2
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: theme.typography.fontFamily
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <Box sx={{ height: 400, width: '100%', p: 2 }}>
      <Radar data={data} options={options} />
    </Box>
  );
};

export default SpiderChart;
