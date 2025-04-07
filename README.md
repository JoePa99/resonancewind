# Brand Resonance App

A comprehensive application for calculating a Resonance Score (0-100) for brands based on five weighted metrics:

- Conversational Depth (10%)
- Community Spread (15%)
- Emotional Intensity (20%)
- Intent Signals (30%)
- Advocacy Language (25%)

## Features

### AI Mode
- Generates realistic brand-specific data for all metrics using large language models
- Calculates overall Resonance Score based on weighted metrics
- Provides advanced analysis including:
  - Topic identification within brand conversations
  - Emotional sentiment classification
  - Advocacy strength detection
  - Geographic and demographic spread visualization
  - Intent signal categorization (awareness, consideration, conversion)

### Web Interface
- Interactive dashboard with overall score and breakdown by metric
- Topic analysis visualization
- Sentiment distribution charts
- Comparative analysis between brands
- Exportable reports

## Technology Stack
- Backend: Python with FastAPI
- Frontend: React
- AI Integration: LangChain with OpenAI
- Data Analysis: Pandas, NumPy, scikit-learn
- Visualization: Plotly, Matplotlib

## Future Extensions
The application is designed to be extended to a Hybrid Mode that combines real data from:
- Reddit
- Twitter/X
- YouTube
- Google Trends

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 14+
- OpenAI API key

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/brand-resonance.git
cd brand-resonance
```

2. Install backend dependencies
```
pip install -r requirements.txt
```

3. Set up environment variables
```
cp .env.example .env
# Edit .env file to add your OpenAI API key
```

4. Install frontend dependencies
```
cd frontend
npm install
```

5. Run the application
```
# In one terminal, start the backend
cd backend
uvicorn api.main:app --reload

# In another terminal, start the frontend
cd frontend
npm start
```

6. Open your browser and navigate to http://localhost:3000

## Documentation
See the `/docs` directory for detailed documentation on:
- API endpoints
- Data models
- LLM integration
- Extending to Hybrid Mode
