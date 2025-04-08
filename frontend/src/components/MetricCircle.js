import React from 'react';
import { Box, Typography } from '@mui/material';

const MetricCircle = ({ value, size = 'medium', color = 'secondary' }) => {
  // Define sizes for different options
  const sizes = {
    small: { width: 40, height: 40, fontSize: 'body2', fontWeight: 'bold' },
    medium: { width: 60, height: 60, fontSize: 'h6', fontWeight: 'bold' },
    large: { width: 100, height: 100, fontSize: 'h3', fontWeight: 'bold' }
  };

  // Get size configuration
  const sizeConfig = sizes[size] || sizes.medium;

  return (
    <Box
      sx={{
        width: sizeConfig.width,
        height: sizeConfig.height,
        borderRadius: '50%',
        bgcolor: `${color}.main`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
        border: '2px solid #fff',
      }}
    >
      <Typography 
        variant={sizeConfig.fontSize} 
        fontWeight={sizeConfig.fontWeight}
      >
        {Math.round(value)}
      </Typography>
    </Box>
  );
};

export default MetricCircle;
