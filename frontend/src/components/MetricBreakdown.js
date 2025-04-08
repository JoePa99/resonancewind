import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import MetricCircle from './MetricCircle';

const MetricBreakdown = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Metric Breakdown
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(metrics).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Paper sx={{ p: 2, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', fontWeight: 'bold', mb: 2 }}>
                {key.replace(/_/g, ' ')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                <MetricCircle value={value.score} size="medium" />
                <Box sx={{ flexGrow: 1, ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {value.key_insights[0]}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricBreakdown;
