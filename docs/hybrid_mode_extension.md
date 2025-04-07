# Extending to Hybrid Mode

This document outlines the approach for extending the Brand Resonance App from AI Mode to Hybrid Mode, which combines real data from external sources with AI-enhanced analysis.

## Overview

Hybrid Mode will integrate data from the following sources:
- Reddit
- Twitter/X
- YouTube
- Google Trends

This real-world data will be combined with AI analysis to provide more accurate and comprehensive brand resonance metrics.

## Architecture Changes

### 1. Data Collection Layer

Create a new module structure for data collection:

```
/data_collectors
  /__init__.py
  /reddit_collector.py
  /twitter_collector.py
  /youtube_collector.py
  /google_trends_collector.py
  /collector_factory.py
```

Each collector should implement a common interface:

```python
class DataCollector:
    """Base class for all data collectors."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        
    def collect_data(self, brand_name: str, timeframe: str, limit: int) -> List[Dict]:
        """
        Collect data for a specific brand.
        
        Args:
            brand_name: Name of the brand
            timeframe: Timeframe for data collection (e.g., "7d", "30d", "90d")
            limit: Maximum number of items to collect
            
        Returns:
            List of collected data items
        """
        raise NotImplementedError("Subclasses must implement collect_data")
```

### 2. Data Processing Layer

Create data processors to transform raw data into a format suitable for analysis:

```
/data_processors
  /__init__.py
  /text_processor.py
  /sentiment_processor.py
  /topic_processor.py
  /intent_processor.py
  /processor_pipeline.py
```

The processor pipeline will handle the flow of data through various processing steps:

```python
class ProcessorPipeline:
    """Pipeline for processing collected data."""
    
    def __init__(self, processors: List[DataProcessor]):
        self.processors = processors
        
    def process(self, data: List[Dict]) -> Dict:
        """
        Process data through all processors in the pipeline.
        
        Args:
            data: Raw data collected from external sources
            
        Returns:
            Processed data ready for analysis
        """
        processed_data = data
        for processor in self.processors:
            processed_data = processor.process(processed_data)
        return processed_data
```

### 3. Hybrid Analysis Engine

Create a hybrid analysis engine that combines real data with AI-generated insights:

```
/hybrid_engine
  /__init__.py
  /hybrid_analyzer.py
  /data_enhancer.py
  /confidence_calculator.py
```

The hybrid analyzer will:
1. Collect real data using the data collectors
2. Process the data using the processor pipeline
3. Enhance the data with AI-generated insights
4. Calculate confidence scores for each metric
5. Generate the final resonance metrics

```python
class HybridAnalyzer:
    """Analyzer that combines real data with AI-generated insights."""
    
    def __init__(self, collectors: Dict[str, DataCollector], pipeline: ProcessorPipeline, llm_generator: LLMMetricGenerator):
        self.collectors = collectors
        self.pipeline = pipeline
        self.llm_generator = llm_generator
        self.enhancer = DataEnhancer(llm_generator)
        self.confidence_calculator = ConfidenceCalculator()
        
    def analyze(self, brand_name: str, industry: str, timeframe: str, additional_context: Optional[str] = None) -> Dict:
        """
        Analyze a brand using hybrid mode.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            timeframe: Timeframe for data collection
            additional_context: Additional context about the brand
            
        Returns:
            Dict with resonance metrics and analysis results
        """
        # Collect data from all sources
        collected_data = {}
        for source, collector in self.collectors.items():
            collected_data[source] = collector.collect_data(brand_name, timeframe, limit=1000)
        
        # Process collected data
        processed_data = {}
        for source, data in collected_data.items():
            processed_data[source] = self.pipeline.process(data)
        
        # Combine data from all sources
        combined_data = self._combine_data(processed_data)
        
        # Enhance data with AI insights
        enhanced_data = self.enhancer.enhance(combined_data, brand_name, industry, additional_context)
        
        # Calculate confidence scores
        confidence_scores = self.confidence_calculator.calculate(combined_data, enhanced_data)
        
        # Generate final metrics
        metrics = self._generate_metrics(enhanced_data, confidence_scores)
        
        return {
            "metrics": metrics,
            "confidence_scores": confidence_scores,
            "data_sources": list(collected_data.keys()),
            "data_counts": {source: len(data) for source, data in collected_data.items()},
            "timeframe": timeframe,
        }
```

### 4. API Extensions

Extend the API to support Hybrid Mode:

```python
@app.post("/analyze/hybrid/")
async def analyze_brand_hybrid(request: HybridAnalysisRequest):
    """
    Analyze a brand using Hybrid Mode.
    
    This endpoint collects real data from external sources and combines it with
    AI-generated insights to calculate the resonance score.
    """
    # Validate API keys
    if not validate_api_keys(request.api_keys):
        raise HTTPException(status_code=400, detail="Invalid or missing API keys")
    
    # Initialize collectors
    collectors = {
        "reddit": RedditCollector(request.api_keys.get("reddit")),
        "twitter": TwitterCollector(request.api_keys.get("twitter")),
        "youtube": YouTubeCollector(request.api_keys.get("youtube")),
        "google_trends": GoogleTrendsCollector(request.api_keys.get("google")),
    }
    
    # Initialize processor pipeline
    pipeline = ProcessorPipeline([
        TextProcessor(),
        SentimentProcessor(),
        TopicProcessor(),
        IntentProcessor(),
    ])
    
    # Initialize hybrid analyzer
    analyzer = HybridAnalyzer(collectors, pipeline, llm_generator)
    
    # Analyze brand
    result = analyzer.analyze(
        request.brand_name,
        request.industry,
        request.timeframe,
        request.additional_context
    )
    
    # Create brand if it doesn't exist
    brand_id = create_brand_if_not_exists(request.brand_name, request.industry, request.additional_context)
    
    # Create and save resonance result
    resonance_result = create_resonance_result(brand_id, request.brand_name, result)
    
    # Generate and save additional analyses
    await generate_additional_analyses_hybrid(brand_id, request, result)
    
    return resonance_result
```

### 5. Frontend Extensions

Extend the frontend to support Hybrid Mode:

1. Add Hybrid Mode option to the analysis form
2. Add API key management in Settings
3. Add data source breakdown in the analysis results
4. Add confidence indicators for each metric
5. Add timeframe selection for data collection

## Implementation Plan

### Phase 1: Infrastructure Setup
- Set up API key management
- Create data collector interfaces
- Implement basic data processing pipeline
- Create hybrid analyzer framework

### Phase 2: Reddit Integration
- Implement Reddit data collector
- Extend data processors for Reddit data
- Test and validate Reddit integration

### Phase 3: Twitter/X Integration
- Implement Twitter/X data collector
- Extend data processors for Twitter/X data
- Test and validate Twitter/X integration

### Phase 4: YouTube Integration
- Implement YouTube data collector
- Extend data processors for YouTube data
- Test and validate YouTube integration

### Phase 5: Google Trends Integration
- Implement Google Trends data collector
- Extend data processors for Google Trends data
- Test and validate Google Trends integration

### Phase 6: Hybrid Analysis Engine
- Implement data enhancer
- Implement confidence calculator
- Integrate all components into hybrid analyzer

### Phase 7: Frontend Integration
- Update UI to support Hybrid Mode
- Add data source breakdown visualizations
- Add confidence indicators

## API Requirements

### Reddit API
- API Key: Client ID and Client Secret
- Endpoints: 
  - `/r/all/search` for brand mentions
  - `/r/{subreddit}/search` for industry-specific mentions
- Rate Limits: 60 requests per minute

### Twitter/X API
- API Key: Bearer Token
- Endpoints:
  - `/2/tweets/search/recent` for recent tweets
  - `/2/tweets/counts/recent` for tweet counts
- Rate Limits: Varies by subscription level

### YouTube API
- API Key: API Key
- Endpoints:
  - `/youtube/v3/search` for video search
  - `/youtube/v3/commentThreads` for comments
- Rate Limits: 10,000 units per day

### Google Trends API
- API Key: None (uses unofficial API)
- Endpoints:
  - `pytrends` library for Python
- Rate Limits: Unofficial, be cautious with request frequency

## Data Storage Considerations

For Hybrid Mode, we'll need to store more data:

1. Raw collected data (optional, for debugging)
2. Processed data (for analysis)
3. Enhanced data (final analysis results)
4. Confidence scores (for transparency)
5. Data source breakdown (for reporting)

Consider using a database like PostgreSQL or MongoDB instead of JSON files for production use.

## Security Considerations

1. API keys should be stored securely (e.g., using environment variables)
2. User data should be encrypted at rest
3. API requests should use HTTPS
4. Rate limiting should be implemented to prevent abuse
5. User authentication and authorization should be added for multi-user support

## Conclusion

Extending to Hybrid Mode will significantly enhance the accuracy and credibility of the Brand Resonance App by incorporating real data from external sources. The modular architecture outlined above allows for gradual implementation and testing of each component, ensuring a smooth transition from AI Mode to Hybrid Mode.
