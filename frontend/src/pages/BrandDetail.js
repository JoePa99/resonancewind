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
  Tabs,
  Tab,
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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Add as AddIcon,
  CompareArrows as CompareIcon,
} from '@mui/icons-material';

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
            variant="outlined"
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
                  <Typography variant="h3">{Math.round(latestResult.overall_score)}</Typography>
                </Box>
                <Box>
                  <Typography variant="h5">Resonance Score</Typography>
                  <Typography variant="subtitle1" color="primary.main">
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

              <Typography variant="h6" gutterBottom>
                Metric Breakdown
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(latestResult.metrics).map(([key, value]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/_/g, ' ')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            bgcolor: 'secondary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                            border: '2px solid #fff',
                          }}
                        >
                          <Typography variant="h6" fontWeight="bold">{Math.round(value.score)}</Typography>
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

          <Box sx={{ mb: 4 }}>
            <Paper sx={{ width: '100%' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { fontWeight: 'bold' } }}
              >
                <Tab label="OVERVIEW" />
                <Tab label="SPIDER CHART" />
                <Tab label="TOPICS" />
                <Tab label="SENTIMENT" />
                <Tab label="ADVOCACY" />
                <Tab label="GEOGRAPHIC" />
                <Tab label="DEMOGRAPHICS" />
                <Tab label="INTENT" />
                <Tab label="HISTORY" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                  Brand Overview
                </Typography>
                {latestResult && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>Summary</Typography>
                        <Typography variant="body2" paragraph>
                          This overview shows the key metrics for {brand?.name}. Use the tabs to explore detailed analyses or view the Spider Chart to compare with other brands.
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Brand Comparison</Typography>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="comparison-brand-label">Add Brand for Comparison</InputLabel>
                          <Select
                            labelId="comparison-brand-label"
                            value={comparisonBrandId}
                            onChange={handleComparisonBrandChange}
                            label="Add Brand for Comparison"
                          >
                            <MenuItem value=""><em>Select a brand</em></MenuItem>
                            {allBrands.map((b) => (
                              <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Button 
                          variant="contained" 
                          startIcon={<AddIcon />} 
                          onClick={handleAddComparisonBrand}
                          disabled={!comparisonBrandId}
                        >
                          Add to Comparison
                        </Button>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>Brands in Comparison:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {brandsForComparison.map((b) => (
                          <Chip 
                            key={b.id} 
                            label={b.name} 
                            onDelete={b.id !== brand?.id ? () => handleRemoveComparisonBrand(b.id) : undefined}
                            color={b.id === brand?.id ? "primary" : "default"}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </Box>
                
                <SpiderChart brands={brandsForComparison} />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Topic Analysis
                </Typography>
                {topicAnalysis ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TopicChart data={topicAnalysis} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Key Topics
                        </Typography>
                        <List>
                          {topicAnalysis.topics.map((topic, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={topic.name}
                                secondary={`Prevalence: ${topic.prevalence}% | Key terms: ${topic.key_terms.join(', ')}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography color="text.secondary">Topic analysis not available</Typography>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={4}>
                <Typography variant="h6" gutterBottom>
                  Sentiment Analysis
                </Typography>
                {sentimentAnalysis ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <SentimentChart data={sentimentAnalysis} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Sentiment Distribution
                        </Typography>
                        <List>
                          {Object.entries(sentimentAnalysis.distribution).map(([sentiment, value]) => (
                            <ListItem key={sentiment}>
                              <ListItemText
                                primary={sentiment}
                                secondary={`${value}%`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography color="text.secondary">Sentiment analysis not available</Typography>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={5}>
                <Typography variant="h6" gutterBottom>
                  Advocacy Analysis
                </Typography>
                {advocacyAnalysis ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" align="center" gutterBottom>
                          Advocacy Strength
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            my: 3,
                          }}
                        >
                          <Box
                            sx={{
                              width: 150,
                              height: 150,
                              borderRadius: '50%',
                              bgcolor: 'success.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="h3">{Math.round(advocacyAnalysis.strength)}</Typography>
                          </Box>
                        </Box>
                        <Typography variant="body1" align="center">
                          {advocacyAnalysis.advocates_percentage}% of conversations show advocacy
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Key Advocacy Phrases
                        </Typography>
                        <List>
                          {advocacyAnalysis.key_advocacy_phrases.map((phrase, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={phrase} />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography color="text.secondary">Advocacy analysis not available</Typography>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={6}>
                <Typography variant="h6" gutterBottom>
                  Geographic Spread
                </Typography>
                {geographicSpread ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <GeographicChart data={geographicSpread} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Regional Distribution
                        </Typography>
                        <List>
                          {Object.entries(geographicSpread.regions).map(([region, value]) => (
                            <ListItem key={region}>
                              <ListItemText
                                primary={region}
                                secondary={`${value}%`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography color="text.secondary">Geographic spread analysis not available</Typography>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={7}>
                <Typography variant="h6" gutterBottom>
                  Demographic Spread
                </Typography>
                {demographicSpread ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <DemographicChart data={demographicSpread} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Age Distribution
                        </Typography>
                        <List>
                          {Object.entries(demographicSpread.age_groups).map(([age, value]) => (
                            <ListItem key={age}>
                              <ListItemText
                                primary={age}
                                secondary={`${value}%`}
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                          Gender Distribution
                        </Typography>
                        <List>
                          {Object.entries(demographicSpread.gender).map(([gender, value]) => (
                            <ListItem key={gender}>
                              <ListItemText
                                primary={gender}
                                secondary={`${value}%`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography color="text.secondary">Demographic spread analysis not available</Typography>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={8}>
                <Typography variant="h6" gutterBottom>
                  Intent Analysis
                </Typography>
                {intentAnalysis ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <IntentChart data={intentAnalysis} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Intent Categories
                        </Typography>
                        <List>
                          {Object.entries(intentAnalysis.categories).map(([category, value]) => (
                            <ListItem key={category}>
                              <ListItemText
                                primary={category.charAt(0).toUpperCase() + category.slice(1)}
                                secondary={`${value}%`}
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                          Key Intent Phrases
                        </Typography>
                        {Object.entries(intentAnalysis.key_phrases).map(([category, phrases]) => (
                          <Box key={category} sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                              {category}:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {phrases.map((phrase, index) => (
                                <Chip key={index} label={phrase} size="small" />
                              ))}
                            </Box>
                          </Box>
                        ))}
                      </Paper>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography color="text.secondary">Intent analysis not available</Typography>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={9}>
                <Typography variant="h6" gutterBottom>
                  Analysis History
                </Typography>
                {results.length > 0 ? (
                  <List>
                    {results.map((result) => (
                      <Paper key={result.id} sx={{ mb: 2, p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                            }}
                          >
                            <Typography variant="h5">{Math.round(result.overall_score)}</Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1">
                              {result.category} ({result.mode.toUpperCase()} Mode)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Analyzed on {new Date(result.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No analysis history available</Typography>
                )}
              </TabPanel>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default BrandDetail;
