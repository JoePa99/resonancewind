import axios from 'axios';

// Get the API URL from environment variables
// In development: use localhost:8000
// In production: use the REACT_APP_API_URL environment variable (set in Vercel)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Brand APIs
export const getBrands = async () => {
  const response = await apiClient.get('/brands/');
  return response.data;
};

export const getBrand = async (brandId) => {
  const response = await apiClient.get(`/brands/${brandId}`);
  return response.data;
};

export const createBrand = async (brandData) => {
  const response = await apiClient.post('/brands/', brandData);
  return response.data;
};

export const updateBrand = async (brandId, brandData) => {
  const response = await apiClient.put(`/brands/${brandId}`, brandData);
  return response.data;
};

export const deleteBrand = async (brandId) => {
  const response = await apiClient.delete(`/brands/${brandId}`);
  return response.data;
};

// Analysis APIs
export const analyzeBrand = async (analysisRequest) => {
  const response = await apiClient.post('/analyze/', analysisRequest);
  return response.data;
};

export const getResults = async (brandId = null) => {
  const url = brandId ? `/results/?brand_id=${brandId}` : '/results/';
  const response = await apiClient.get(url);
  return response.data;
};

export const getResult = async (resultId) => {
  const response = await apiClient.get(`/results/${resultId}`);
  return response.data;
};

// Topic Analysis APIs
export const getTopicAnalysis = async (brandId) => {
  const response = await apiClient.get(`/topics/${brandId}`);
  return response.data;
};

// Sentiment Analysis APIs
export const getSentimentAnalysis = async (brandId) => {
  const response = await apiClient.get(`/sentiment/${brandId}`);
  return response.data;
};

// Advocacy Analysis APIs
export const getAdvocacyAnalysis = async (brandId) => {
  const response = await apiClient.get(`/advocacy/${brandId}`);
  return response.data;
};

// Geographic Spread APIs
export const getGeographicSpread = async (brandId) => {
  const response = await apiClient.get(`/geographic/${brandId}`);
  return response.data;
};

// Demographic Spread APIs
export const getDemographicSpread = async (brandId) => {
  const response = await apiClient.get(`/demographic/${brandId}`);
  return response.data;
};

// Intent Analysis APIs
export const getIntentAnalysis = async (brandId) => {
  const response = await apiClient.get(`/intent/${brandId}`);
  return response.data;
};

// Comparison APIs
export const compareBrands = async (brandIds) => {
  const response = await apiClient.post('/compare/', brandIds);
  return response.data;
};

// Report APIs
export const generateReport = async (reportConfig) => {
  const response = await apiClient.post('/report/', reportConfig);
  return response.data;
};

const apiService = {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  analyzeBrand,
  getResults,
  getResult,
  getTopicAnalysis,
  getSentimentAnalysis,
  getAdvocacyAnalysis,
  getGeographicSpread,
  getDemographicSpread,
  getIntentAnalysis,
  compareBrands,
  generateReport,
};

export default apiService;
