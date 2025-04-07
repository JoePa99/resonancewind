import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from '@mui/material';
import { analyzeBrand } from '../services/api';

const industries = [
  'Automotive',
  'Technology',
  'Fashion',
  'Food & Beverage',
  'Entertainment',
  'Finance',
  'Healthcare',
  'Retail',
  'Travel',
  'Sports',
  'Luxury',
  'Consumer Goods',
  'Media',
  'Telecommunications',
  'Energy',
  'Other',
];

const BrandAnalysis = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  const [formData, setFormData] = useState({
    brand_name: '',
    industry: '',
    additional_context: '',
    mode: 'ai',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const analysisResult = await analyzeBrand({
        brand_name: formData.brand_name,
        industry: formData.industry,
        additional_context: formData.additional_context,
        mode: formData.mode,
      });
      
      setResult(analysisResult);
      setActiveStep(2);
      setLoading(false);
    } catch (err) {
      console.error('Error analyzing brand:', err);
      setError('Failed to analyze brand. Please try again later.');
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/brands/${result.brand_id}`);
  };

  const steps = ['Enter Brand Information', 'Confirm Analysis', 'View Results'];

  const validateStep = () => {
    if (activeStep === 0) {
      return formData.brand_name.trim() !== '' && formData.industry.trim() !== '';
    }
    return true;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter Brand Information
            </Typography>
            <TextField
              fullWidth
              label="Brand Name"
              name="brand_name"
              value={formData.brand_name}
              onChange={handleInputChange}
              margin="normal"
              required
              error={formData.brand_name.trim() === ''}
              helperText={formData.brand_name.trim() === '' ? 'Brand name is required' : ''}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Industry</InputLabel>
              <Select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                label="Industry"
                error={formData.industry.trim() === ''}
              >
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Additional Context (optional)"
              name="additional_context"
              value={formData.additional_context}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              placeholder="Enter any additional information about the brand that might be relevant for analysis..."
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Analysis
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Brand: <strong>{formData.brand_name}</strong>
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Industry: <strong>{formData.industry}</strong>
              </Typography>
              {formData.additional_context && (
                <Typography variant="subtitle1" gutterBottom>
                  Additional Context: <em>{formData.additional_context}</em>
                </Typography>
              )}
              <Typography variant="subtitle1" gutterBottom>
                Analysis Mode: <strong>AI Mode</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                The AI will generate realistic brand-specific data for all metrics and calculate an overall Resonance Score.
              </Typography>
            </Paper>
            <Alert severity="info" sx={{ mb: 3 }}>
              This analysis may take a minute or two to complete as our AI generates comprehensive metrics for your brand.
            </Alert>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            {result && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 3,
                      }}
                    >
                      <Typography variant="h3">{Math.round(result.overall_score)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h5">{result.brand_name}</Typography>
                      <Typography variant="subtitle1" color="primary.main">
                        {result.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {result.category_description}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Metric Breakdown
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(result.metrics).map(([key, value]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                            {key.replace(/_/g, ' ')}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'secondary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 1,
                              }}
                            >
                              <Typography variant="body1">{Math.round(value.score)}</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {value.key_insights[0]}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Brand Analysis
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6">Analyzing {formData.brand_name}...</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This may take a minute as we generate comprehensive metrics.
              </Typography>
            </Box>
          ) : (
            renderStepContent()
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? () => navigate('/') : handleBack}
              disabled={loading}
            >
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleViewDetails}
                  disabled={!result}
                >
                  View Detailed Analysis
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={activeStep === steps.length - 2 ? handleSubmit : handleNext}
                  disabled={!validateStep() || loading}
                >
                  {activeStep === steps.length - 2 ? 'Analyze Brand' : 'Next'}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BrandAnalysis;
