import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

// Import custom components
import MetricCircle from '../components/MetricCircle';
import MetricBreakdown from '../components/MetricBreakdown';
import BrandDetailTabs from '../components/BrandDetailTabs';

import {
  getBrand,
  getBrands,
  getResults,
  getTopicAnalysis,
  getSentimentAnalysis,
  getAdvocacyAnalysis,
  getGeographicSpread,
  getDemographicSpread,
  getIntentAnalysis,
  compareBrands,
} from '../services/api';

// Import chart components (these would be created separately)
import TopicChart from '../components/charts/TopicChart';
import SentimentChart from '../components/charts/SentimentChart';
import GeographicChart from '../components/charts/GeographicChart';
import DemographicChart from '../components/charts/DemographicChart';
import IntentChart from '../components/charts/IntentChart';
import SpiderChart from '../components/charts/SpiderChart';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const BrandDetail = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  // Initialize to 0 (OVERVIEW tab)
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [brand, setBrand] = useState(null);
  const [results, setResults] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [topicAnalysis, setTopicAnalysis] = useState(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(null);
  const [advocacyAnalysis, setAdvocacyAnalysis] = useState(null);
  const [geographicSpread, setGeographicSpread] = useState(null);
  const [demographicSpread, setDemographicSpread] = useState(null);
  const [intentAnalysis, setIntentAnalysis] = useState(null);
  
  // State for brand comparison
  const [allBrands, setAllBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [comparisonBrandId, setComparisonBrandId] = useState('');
  const [brandsForComparison, setBrandsForComparison] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch brand details
        const brandData = await getBrand(brandId);
        setBrand(brandData);
        
        // Fetch results for this brand
        const resultsData = await getResults(brandId);
        setResults(resultsData);
        
        // Fetch all brands for comparison
        const allBrandsData = await getBrands();
        setAllBrands(allBrandsData.filter(b => b.id !== brandId)); // Exclude current brand
        
        // Initialize brands for comparison with current brand
        if (brandData) {
          const currentBrandForComparison = {
            id: brandData.id,
            name: brandData.name,
            metrics: {
              conversational_depth: 0,
              community_spread: 0,
              emotional_intensity: 0,
              intent_signals: 0,
              advocacy_language: 0
            }
          };
          setBrandsForComparison([currentBrandForComparison]);
        }
        
        // Get the latest result
        if (resultsData.length > 0) {
          const sortedResults = [...resultsData].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setLatestResult(sortedResults[0]);
          
          // Update metrics for the current brand
          if (sortedResults[0] && brandData) {
            const updatedBrandsForComparison = [...brandsForComparison];
            if (updatedBrandsForComparison.length > 0) {
              updatedBrandsForComparison[0] = {
                ...updatedBrandsForComparison[0],
                metrics: {
                  conversational_depth: sortedResults[0].metrics.conversational_depth,
                  community_spread: sortedResults[0].metrics.community_spread,
                  emotional_intensity: sortedResults[0].metrics.emotional_intensity,
                  intent_signals: sortedResults[0].metrics.intent_signals,
                  advocacy_language: sortedResults[0].metrics.advocacy_language
                }
              };
              setBrandsForComparison(updatedBrandsForComparison);
            }
          }
          
          // Fetch additional analyses
          try {
            const [
              topicData,
              sentimentData,
              advocacyData,
              geographicData,
              demographicData,
              intentData,
            ] = await Promise.all([
              getTopicAnalysis(brandId),
              getSentimentAnalysis(brandId),
              getAdvocacyAnalysis(brandId),
              getGeographicSpread(brandId),
              getDemographicSpread(brandId),
              getIntentAnalysis(brandId),
            ]);
            
            setTopicAnalysis(topicData);
            setSentimentAnalysis(sentimentData);
            setAdvocacyAnalysis(advocacyData);
            setGeographicSpread(geographicData);
            setDemographicSpread(demographicData);
            setIntentAnalysis(intentData);
          } catch (analysisErr) {
            console.error('Error fetching analyses:', analysisErr);
            // Continue even if some analyses fail
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching brand details:', err);
        setError('Failed to load brand details. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [brandId]);

  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue);
    setTabValue(newValue);
  };

  const handleNewAnalysis = () => {
    navigate('/analyze');
  };

  const handleExportReport = () => {
    // Implement report export functionality
    alert('Export report functionality to be implemented');
  };
  
  const handleComparisonBrandChange = (event) => {
    setComparisonBrandId(event.target.value);
  };
  
  const handleAddComparisonBrand = async () => {
    if (!comparisonBrandId) return;
    
    try {
      // Check if brand is already in comparison
      if (brandsForComparison.some(b => b.id === comparisonBrandId)) {
        alert('This brand is already in the comparison');
        return;
      }
      
      // Get brand details
      const brandData = await getBrand(comparisonBrandId);
      
      // Get latest result for this brand
      const resultsData = await getResults(comparisonBrandId);
      
      if (resultsData.length > 0) {
        const sortedResults = [...resultsData].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        const latestResult = sortedResults[0];
        
        // Add brand to comparison
        const newBrandForComparison = {
          id: brandData.id,
          name: brandData.name,
          metrics: {
            conversational_depth: latestResult.metrics.conversational_depth,
            community_spread: latestResult.metrics.community_spread,
            emotional_intensity: latestResult.metrics.emotional_intensity,
            intent_signals: latestResult.metrics.intent_signals,
            advocacy_language: latestResult.metrics.advocacy_language
          }
        };
        
        setBrandsForComparison([...brandsForComparison, newBrandForComparison]);
        setComparisonBrandId(''); // Reset selection
      } else {
        alert('No analysis results available for this brand');
      }
    } catch (err) {
      console.error('Error adding brand for comparison:', err);
      alert('Failed to add brand for comparison');
    }
  };
  
  const handleRemoveComparisonBrand = (brandId) => {
    // Don't allow removing the main brand
    if (brandId === brand?.id) {
      alert('Cannot remove the main brand from comparison');
      return;
    }
    
    setBrandsForComparison(brandsForComparison.filter(b => b.id !== brandId));
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

  if (!brand) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Brand not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {brand.name}
          </Typography>
          <Chip label={brand.industry} color="primary" sx={{ mr: 1 }} />
          <Chip label={latestResult ? `Score: ${Math.round(latestResult.overall_score)}` : 'No Analysis'} color="secondary" />
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleNewAnalysis}
            sx={{ mr: 2 }}
          >
            New Analysis
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {!latestResult ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No analysis results available for this brand. Click "New Analysis" to analyze this brand.
        </Alert>
      ) : (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MetricCircle value={latestResult.overall_score} size="large" color="primary" />
                <Box sx={{ ml: 3 }}>
                  <Typography variant="h5">Resonance Score</Typography>
                  <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                    {latestResult.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {latestResult.category_description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Last updated: {new Date(latestResult.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* Use the new MetricBreakdown component */}
              <MetricBreakdown metrics={latestResult.metrics} />
            </CardContent>
          </Card>

          {/* Use the new BrandDetailTabs component */}
          <BrandDetailTabs
            brand={brand}
            topicAnalysis={topicAnalysis}
            sentimentAnalysis={sentimentAnalysis}
            advocacyAnalysis={advocacyAnalysis}
            geographicSpread={geographicSpread}
            demographicSpread={demographicSpread}
            intentAnalysis={intentAnalysis}
            brandsForComparison={brandsForComparison}
            handleAddComparisonBrand={handleAddComparisonBrand}
            handleRemoveComparisonBrand={handleRemoveComparisonBrand}
            comparisonBrandId={comparisonBrandId}
            handleComparisonBrandChange={handleComparisonBrandChange}
            allBrands={allBrands}
          />
        </>
      )}
    </Box>
  );
};

export default BrandDetail;
