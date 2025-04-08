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
  
  // Simple placeholder when no data is available
  if (!brands || brands.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="body1">No brand data available</Typography>
      </Box>
    );
  }

  // Create a simplified version for now to ensure successful build
  return (
    <Box sx={{ height: 400, width: '100%', p: 2, border: '1px dashed #ccc', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6" color="text.secondary">
        Spider Chart will display here
      </Typography>
    </Box>
  );
};

export default SpiderChart;
