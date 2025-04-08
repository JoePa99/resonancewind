import React from 'react';
import { Box, Typography } from '@mui/material';

const MetricCircle = ({ value, size = 'small', color = 'secondary' }) => {
  // Define sizes for different options
  const sizes = {
    small: 50,
    medium: 70,
    large: 100
  };

  const circleSize = sizes[size];
  const fontSize = size === 'large' ? 'h3' : size === 'medium' ? 'h5' : 'h6';

  return (
    <Box
      sx={{
        width: circleSize,
        height: circleSize,
        minWidth: circleSize,
        minHeight: circleSize,
        borderRadius: '50%',
        bgcolor: `${color}.main`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
        border: '2px solid #fff',
        flexShrink: 0,
      }}
    >
      <Typography variant={fontSize} fontWeight="bold">{Math.round(value)}</Typography>
    </Box>
  );
};

export default MetricCircle;
