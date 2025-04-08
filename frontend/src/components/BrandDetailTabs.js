import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography } from '@mui/material';
import SpiderChart from './charts/SpiderChart';
import TopicChart from './charts/TopicChart';
import SentimentChart from './charts/SentimentChart';
import GeographicChart from './charts/GeographicChart';
import DemographicChart from './charts/DemographicChart';
import IntentChart from './charts/IntentChart';

// TabPanel component to handle tab content display
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`brand-tabpanel-${index}`}
      aria-labelledby={`brand-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const BrandDetailTabs = ({ 
  brand, 
  topicAnalysis, 
  sentimentAnalysis, 
  advocacyAnalysis, 
  geographicSpread, 
  demographicSpread, 
  intentAnalysis,
  brandsForComparison,
  handleAddComparisonBrand,
  handleRemoveComparisonBrand,
  comparisonBrandId,
  handleComparisonBrandChange,
  allBrands
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue);
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            '& .MuiTab-root': { 
              fontWeight: 'bold',
              fontSize: '0.875rem',
              letterSpacing: '0.5px'
            } 
          }}
        >
          <Tab label="OVERVIEW" id="brand-tab-0" aria-controls="brand-tabpanel-0" />
          <Tab label="SPIDER CHART" id="brand-tab-1" aria-controls="brand-tabpanel-1" />
          <Tab label="TOPICS" id="brand-tab-2" aria-controls="brand-tabpanel-2" />
          <Tab label="SENTIMENT" id="brand-tab-3" aria-controls="brand-tabpanel-3" />
          <Tab label="ADVOCACY" id="brand-tab-4" aria-controls="brand-tabpanel-4" />
          <Tab label="GEOGRAPHIC" id="brand-tab-5" aria-controls="brand-tabpanel-5" />
          <Tab label="DEMOGRAPHICS" id="brand-tab-6" aria-controls="brand-tabpanel-6" />
          <Tab label="INTENT" id="brand-tab-7" aria-controls="brand-tabpanel-7" />
          <Tab label="HISTORY" id="brand-tab-8" aria-controls="brand-tabpanel-8" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Brand Overview
          </Typography>
          <Typography variant="body1">
            This overview shows the key metrics for {brand?.name}. Use the tabs to explore detailed analyses or view the Spider Chart to compare with other brands.
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Brand Comparison
          </Typography>
          <SpiderChart brands={brandsForComparison} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Topic Analysis
          </Typography>
          {topicAnalysis ? (
            <TopicChart data={topicAnalysis} />
          ) : (
            <Typography color="text.secondary">Topic analysis not available</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Sentiment Analysis
          </Typography>
          {sentimentAnalysis ? (
            <SentimentChart data={sentimentAnalysis} />
          ) : (
            <Typography color="text.secondary">Sentiment analysis not available</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Advocacy Analysis
          </Typography>
          {advocacyAnalysis ? (
            <Box>
              <Typography variant="body1" paragraph>
                {advocacyAnalysis.summary}
              </Typography>
              {/* Add more advocacy analysis content here */}
            </Box>
          ) : (
            <Typography color="text.secondary">Advocacy analysis not available</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>
            Geographic Spread
          </Typography>
          {geographicSpread ? (
            <GeographicChart data={geographicSpread} />
          ) : (
            <Typography color="text.secondary">Geographic spread data not available</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={6}>
          <Typography variant="h6" gutterBottom>
            Demographic Spread
          </Typography>
          {demographicSpread ? (
            <DemographicChart data={demographicSpread} />
          ) : (
            <Typography color="text.secondary">Demographic spread data not available</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={7}>
          <Typography variant="h6" gutterBottom>
            Intent Analysis
          </Typography>
          {intentAnalysis ? (
            <IntentChart data={intentAnalysis} />
          ) : (
            <Typography color="text.secondary">Intent analysis not available</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={8}>
          <Typography variant="h6" gutterBottom>
            Analysis History
          </Typography>
          <Typography color="text.secondary">
            Analysis history will be displayed here.
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default BrandDetailTabs;
