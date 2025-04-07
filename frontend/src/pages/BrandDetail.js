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
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

import {
  getBrand,
  getResults,
  getTopicAnalysis,
  getSentimentAnalysis,
  getAdvocacyAnalysis,
  getGeographicSpread,
  getDemographicSpread,
  getIntentAnalysis,
} from '../services/api';

// Import chart components (these would be created separately)
import TopicChart from '../components/charts/TopicChart';
import SentimentChart from '../components/charts/SentimentChart';
import GeographicChart from '../components/charts/GeographicChart';
import DemographicChart from '../components/charts/DemographicChart';
import IntentChart from '../components/charts/IntentChart';

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
        
        // Get the latest result
        if (resultsData.length > 0) {
          const sortedResults = [...resultsData].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setLatestResult(sortedResults[0]);
          
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
    setTabValue(newValue);
  };

  const handleNewAnalysis = () => {
    navigate('/analyze');
  };

  const handleExportReport = () => {
    // This would be implemented to generate and download a report
    alert('Export report functionality would be implemented here');
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

          <Box sx={{ mb: 4 }}>
            <Paper sx={{ width: '100%' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Topics" />
                <Tab label="Sentiment" />
                <Tab label="Advocacy" />
                <Tab label="Geographic" />
                <Tab label="Demographics" />
                <Tab label="Intent" />
                <Tab label="History" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
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

              <TabPanel value={tabValue} index={1}>
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

              <TabPanel value={tabValue} index={2}>
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

              <TabPanel value={tabValue} index={3}>
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

              <TabPanel value={tabValue} index={4}>
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

              <TabPanel value={tabValue} index={5}>
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

              <TabPanel value={tabValue} index={6}>
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
