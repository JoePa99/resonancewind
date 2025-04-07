import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';

const getScoreColor = (score) => {
  if (score >= 80) return '#4caf50'; // Green
  if (score >= 60) return '#2196f3'; // Blue
  if (score >= 40) return '#ff9800'; // Orange
  return '#f44336'; // Red
};

const getScoreVariant = (score) => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'error';
};

const ResonanceScoreCard = ({ brandName, score, category, metrics, onClick }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={onClick} sx={{ flexGrow: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div" noWrap sx={{ mb: 1 }}>
            {brandName}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                mr: 2,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: `4px solid ${getScoreColor(score)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" component="div" color={getScoreColor(score)}>
                  {Math.round(score)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Resonance Score
              </Typography>
              <Chip
                label={category}
                size="small"
                color={getScoreVariant(score)}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Metric Breakdown
          </Typography>
          
          {metrics && metrics.map((metric) => (
            <Box key={metric.name} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                  {metric.name.replace(/_/g, ' ')}
                </Typography>
                <Typography variant="caption">{metric.score}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metric.score}
                color={getScoreVariant(metric.score)}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          ))}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ResonanceScoreCard;
