// Mock data for testing chart components
export const mockTopicAnalysis = {
  topics: [
    { name: 'Product Quality', prevalence: 35, key_terms: ['reliable', 'durable', 'quality'] },
    { name: 'Customer Service', prevalence: 25, key_terms: ['helpful', 'responsive', 'support'] },
    { name: 'Price', prevalence: 20, key_terms: ['affordable', 'value', 'cost'] },
    { name: 'Availability', prevalence: 15, key_terms: ['stock', 'inventory', 'available'] },
    { name: 'Warranty', prevalence: 5, key_terms: ['guarantee', 'warranty', 'return'] }
  ],
  summary: 'Product quality is the most discussed topic, followed by customer service and pricing.'
};

export const mockSentimentAnalysis = {
  distribution: {
    'Positive': 65,
    'Neutral': 25,
    'Negative': 10
  },
  key_phrases: {
    'positive': ['great quality', 'excellent service', 'reliable parts'],
    'negative': ['expensive', 'delayed shipping', 'out of stock']
  },
  summary: 'Overall sentiment is predominantly positive, with customers praising product quality and service.'
};

export const mockAdvocacyAnalysis = {
  strength: 75,
  advocates_percentage: 42,
  key_advocacy_phrases: [
    'highly recommend NAPA parts',
    'always choose NAPA for my repairs',
    'best auto parts on the market',
    'won\'t use anything else'
  ],
  summary: 'NAPA has a strong base of advocates who actively recommend the brand to others.'
};

export const mockGeographicSpread = {
  regions: {
    'Northeast': 30,
    'Midwest': 25,
    'South': 20,
    'West': 15,
    'International': 10
  },
  top_cities: [
    'Chicago', 'New York', 'Los Angeles', 'Dallas', 'Atlanta'
  ],
  summary: 'Brand presence is strongest in the Northeast and Midwest regions.'
};

export const mockDemographicSpread = {
  age_groups: {
    '18-24': 5,
    '25-34': 15,
    '35-44': 30,
    '45-54': 25,
    '55-64': 15,
    '65+': 10
  },
  gender: {
    'Male': 70,
    'Female': 30
  },
  income_levels: {
    'Under $50k': 20,
    '$50k-$100k': 45,
    'Over $100k': 35
  },
  summary: 'Core demographic is middle-aged males with middle to high income.'
};

export const mockIntentAnalysis = {
  categories: {
    'purchase': 40,
    'research': 30,
    'support': 20,
    'complaint': 10
  },
  key_phrases: {
    'purchase': ['where to buy', 'best price for', 'need to get'],
    'research': ['comparing brands', 'quality of', 'reviews for'],
    'support': ['how to install', 'warranty claim', 'replacement parts'],
    'complaint': ['didn\'t fit', 'too expensive', 'out of stock']
  },
  summary: 'Most conversations indicate purchase intent, followed by product research.'
};

export const mockBrandMetrics = {
  conversational_depth: {
    score: 7.5,
    key_insights: ['Discussions about NAPA Auto Parts often include specific product or service details, suggesting a level of depth in the conversations.']
  },
  community_spread: {
    score: 8.2,
    key_insights: ['NAPA Auto Parts is discussed across a variety of platforms, including social media, auto repair forums, and review sites.']
  },
  emotional_intensity: {
    score: 6.5,
    key_insights: ['The brand\'s communications and actions are generally well received, but they do not typically evoke strong emotional responses.']
  },
  intent_signals: {
    score: 7.8,
    key_insights: ['High level of brand awareness and engagement in discussions about auto parts and accessories.']
  },
  advocacy_language: {
    score: 8.5,
    key_insights: ['NAPA Auto Parts is often recommended by consumers for its high-quality products and excellent customer service.']
  }
};
