import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Analytics as AnalyticsIcon,
  Compare as CompareIcon,
} from '@mui/icons-material';

import { getBrands, getResults } from '../services/api';
import ResonanceScoreCard from '../components/ResonanceScoreCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [brandsData, resultsData] = await Promise.all([
          getBrands(),
          getResults(),
        ]);
        
        setBrands(brandsData);
        
        // Sort results by timestamp (most recent first)
        const sortedResults = resultsData.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        ).slice(0, 5); // Only show 5 most recent
        
        setRecentResults(sortedResults);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAnalyzeBrand = () => {
    navigate('/analyze');
  };

  const handleCompareBrands = () => {
    navigate('/compare');
  };

  const handleViewBrand = (brandId) => {
    navigate(`/brands/${brandId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AnalyticsIcon />}
            onClick={handleAnalyzeBrand}
            sx={{ mr: 2 }}
          >
            Analyze Brand
          </Button>
          <Button
            variant="outlined"
            startIcon={<CompareIcon />}
            onClick={handleCompareBrands}
          >
            Compare Brands
          </Button>
        </Box>
      </Box>

      {brands.length === 0 && recentResults.length === 0 ? (
        <Card sx={{ mb: 4, p: 4, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Welcome to Brand Resonance
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Get started by analyzing your first brand to calculate its Resonance Score.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAnalyzeBrand}
              size="large"
              sx={{ mt: 2 }}
            >
              Analyze Your First Brand
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {recentResults.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Recent Analyses
              </Typography>
              <Grid container spacing={3}>
                {recentResults.map((result) => (
                  <Grid item xs={12} sm={6} md={4} key={result.id}>
                    <ResonanceScoreCard
                      brandName={result.brand_name}
                      score={result.overall_score}
                      category={result.category}
                      metrics={Object.entries(result.metrics).map(([key, value]) => ({
                        name: key,
                        score: value.score,
                      }))}
                      onClick={() => handleViewBrand(result.brand_id)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {brands.length > 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Your Brands
              </Typography>
              <Paper>
                <List>
                  {brands.map((brand, index) => (
                    <React.Fragment key={brand.id}>
                      <ListItem
                        button
                        onClick={() => handleViewBrand(brand.id)}
                        secondaryAction={
                          <Chip
                            label={brand.industry}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        }
                      >
                        <ListItemText
                          primary={brand.name}
                          secondary={brand.description || 'No description'}
                        />
                      </ListItem>
                      {index < brands.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;
