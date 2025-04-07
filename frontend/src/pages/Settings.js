import React, { useState } from 'react';
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
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Grid,
  Paper,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

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

const Settings = () => {
  const [settings, setSettings] = useState({
    defaultMode: 'ai',
    defaultIndustry: '',
    theme: 'light',
    apiKeys: {
      openai: '',
      reddit: '',
      twitter: '',
      google: '',
    },
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSettingChange = (section, field, value) => {
    if (section) {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [field]: value,
        },
      });
    } else {
      setSettings({
        ...settings,
        [field]: value,
      });
    }
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend or localStorage
    console.log('Saving settings:', settings);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Settings saved successfully',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application Settings
              </Typography>
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Default Analysis Mode</InputLabel>
                  <Select
                    value={settings.defaultMode}
                    onChange={(e) => handleSettingChange(null, 'defaultMode', e.target.value)}
                    label="Default Analysis Mode"
                  >
                    <MenuItem value="ai">AI Mode</MenuItem>
                    <MenuItem value="hybrid" disabled>Hybrid Mode (Coming Soon)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Default Industry</InputLabel>
                  <Select
                    value={settings.defaultIndustry}
                    onChange={(e) => handleSettingChange(null, 'defaultIndustry', e.target.value)}
                    label="Default Industry"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.theme === 'dark'}
                      onChange={(e) => handleSettingChange(null, 'theme', e.target.checked ? 'dark' : 'light')}
                      color="primary"
                    />
                  }
                  label="Dark Theme"
                  sx={{ mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Management
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button variant="outlined" color="primary" fullWidth sx={{ mb: 2 }}>
                  Export All Data
                </Button>
                <Button variant="outlined" color="error" fullWidth>
                  Clear All Data
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Keys (for Hybrid Mode)
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                These API keys will be used when Hybrid Mode is enabled to fetch real data from external sources.
              </Alert>

              <TextField
                fullWidth
                label="OpenAI API Key"
                value={settings.apiKeys.openai}
                onChange={(e) => handleSettingChange('apiKeys', 'openai', e.target.value)}
                margin="normal"
                type="password"
              />

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Social Media APIs (Coming Soon)
              </Typography>

              <TextField
                fullWidth
                label="Reddit API Key"
                value={settings.apiKeys.reddit}
                onChange={(e) => handleSettingChange('apiKeys', 'reddit', e.target.value)}
                margin="normal"
                type="password"
                disabled
              />

              <TextField
                fullWidth
                label="Twitter/X API Key"
                value={settings.apiKeys.twitter}
                onChange={(e) => handleSettingChange('apiKeys', 'twitter', e.target.value)}
                margin="normal"
                type="password"
                disabled
              />

              <TextField
                fullWidth
                label="Google API Key"
                value={settings.apiKeys.google}
                onChange={(e) => handleSettingChange('apiKeys', 'google', e.target.value)}
                margin="normal"
                type="password"
                disabled
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          size="large"
        >
          Save Settings
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
