import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { getBrands, compareBrands } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const BrandComparison = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await getBrands();
        setBrands(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load brands. Please try again later.');
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedBrands(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleCompare = async () => {
    if (selectedBrands.length < 2) {
      setError('Please select at least two brands to compare.');
      return;
    }

    try {
      setComparing(true);
      setError(null);
      
      const result = await compareBrands(selectedBrands);
      setComparisonResult(result);
      setComparing(false);
    } catch (err) {
      console.error('Error comparing brands:', err);
      setError('Failed to compare brands. Please try again later.');
      setComparing(false);
    }
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  // Generate random colors for each brand
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360; // Use golden ratio to spread colors
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  };

  const renderComparisonChart = () => {
    if (!comparisonResult) return null;

    const brandNames = comparisonResult.brands;
    const colors = generateColors(brandNames.length);

    if (chartType === 'bar') {
      // Overall scores comparison
      const overallScoreData = {
        labels: brandNames,
        datasets: [
          {
            label: 'Overall Resonance Score',
            data: brandNames.map(brand => comparisonResult.overall_scores[brand]),
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('60%', '70%')),
            borderWidth: 1,
          },
        ],
      };

      const overallScoreOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Overall Resonance Score Comparison',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
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
              text: 'Score',
            },
          },
        },
      };

      return (
        <Box sx={{ height: 400, mb: 4 }}>
          <Bar data={overallScoreData} options={overallScoreOptions} />
        </Box>
      );
    } else if (chartType === 'radar') {
      // Metrics comparison using radar chart
      const metricNames = Object.keys(comparisonResult.metric_scores);
      
      const radarData = {
        labels: metricNames.map(metric => metric.replace(/_/g, ' ')),
        datasets: brandNames.map((brand, index) => ({
          label: brand,
          data: metricNames.map(metric => comparisonResult.metric_scores[metric][brand]),
          backgroundColor: `${colors[index]}40`,
          borderColor: colors[index],
          borderWidth: 2,
          pointBackgroundColor: colors[index],
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors[index],
        })),
      };

      const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true,
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Metric Comparison',
          },
        },
      };

      return (
        <Box sx={{ height: 500, mb: 4 }}>
          <Radar data={radarData} options={radarOptions} />
        </Box>
      );
    }

    return null;
  };

  const renderMetricComparison = () => {
    if (!comparisonResult) return null;

    const brandNames = comparisonResult.brands;
    const metricNames = Object.keys(comparisonResult.metric_scores);
    const colors = generateColors(brandNames.length);

    return metricNames.map(metric => {
      const metricData = {
        labels: brandNames,
        datasets: [
          {
            label: metric.replace(/_/g, ' '),
            data: brandNames.map(brand => comparisonResult.metric_scores[metric][brand]),
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('60%', '70%')),
            borderWidth: 1,
          },
        ],
      };

      const metricOptions = {
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
                return `${label}: ${value}`;
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
              text: 'Score',
            },
          },
        },
      };

      return (
        <Grid item xs={12} md={6} key={metric}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'capitalize' }}>
              {metric.replace(/_/g, ' ')}
            </Typography>
            <Box sx={{ height: 230 }}>
              <Bar data={metricData} options={metricOptions} />
            </Box>
          </Paper>
        </Grid>
      );
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Brand Comparison
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select Brands to Compare
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="brand-select-label">Brands</InputLabel>
            <Select
              labelId="brand-select-label"
              multiple
              value={selectedBrands}
              onChange={handleBrandChange}
              input={<OutlinedInput id="select-multiple-chip" label="Brands" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const brand = brands.find(b => b.id === value);
                    return (
                      <Chip key={value} label={brand ? brand.name : value} />
                    );
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
              disabled={loading}
            >
              {brands.map((brand) => (
                <MenuItem
                  key={brand.id}
                  value={brand.id}
                >
                  {brand.name} ({brand.industry})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleCompare}
            disabled={selectedBrands.length < 2 || comparing}
            fullWidth
          >
            {comparing ? <CircularProgress size={24} /> : 'Compare Brands'}
          </Button>
        </CardContent>
      </Card>

      {comparisonResult && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Comparison Results
              </Typography>
              <Box>
                <Button
                  variant={chartType === 'bar' ? 'contained' : 'outlined'}
                  onClick={() => handleChartTypeChange('bar')}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Bar Chart
                </Button>
                <Button
                  variant={chartType === 'radar' ? 'contained' : 'outlined'}
                  onClick={() => handleChartTypeChange('radar')}
                  size="small"
                >
                  Radar Chart
                </Button>
              </Box>
            </Box>

            {renderComparisonChart()}

            <Typography variant="h6" gutterBottom>
              Metric Breakdown
            </Typography>
            <Grid container spacing={3}>
              {renderMetricComparison()}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BrandComparison;
