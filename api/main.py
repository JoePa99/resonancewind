"""
Main FastAPI application for the Brand Resonance App.
"""
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uuid
from typing import Dict, List, Optional, Any
import os
import json
from datetime import datetime

from models.data_models import (
    Brand, 
    ResonanceResult, 
    AnalysisRequest,
    TopicAnalysis,
    SentimentDistribution,
    AdvocacyAnalysis,
    GeographicSpread,
    DemographicSpread,
    IntentAnalysis,
    ComparisonResult,
    ReportConfig
)
from models.scoring_engine import ResonanceScorer
from models.llm_integration import LLMMetricGenerator

# Initialize FastAPI app
app = FastAPI(
    title="Brand Resonance API",
    description="API for calculating and analyzing brand resonance scores",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://resonancewind.vercel.app",  # Vercel production URL
        "http://localhost:3000",             # Local development
        "*"                                 # Allow all origins for testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize scoring engine and LLM generator
scorer = ResonanceScorer()
llm_generator = LLMMetricGenerator()

# In-memory storage (would be replaced with a database in production)
brands = {}
resonance_results = {}
topic_analyses = {}
sentiment_analyses = {}
advocacy_analyses = {}
geographic_spreads = {}
demographic_spreads = {}
intent_analyses = {}
comparison_results = {}

# Helper function to save data to JSON files
def save_to_json(data, filename):
    """Save data to a JSON file in the data directory."""
    os.makedirs("data", exist_ok=True)
    with open(f"data/{filename}.json", "w") as f:
        json.dump(data, f, default=str)

# Helper function to load data from JSON files
def load_from_json(filename):
    """Load data from a JSON file in the data directory."""
    try:
        with open(f"data/{filename}.json", "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

# Load data on startup
@app.on_event("startup")
async def startup_event():
    """Load data from JSON files on startup."""
    global brands, resonance_results, topic_analyses, sentiment_analyses
    global advocacy_analyses, geographic_spreads, demographic_spreads, intent_analyses
    
    brands = load_from_json("brands")
    resonance_results = load_from_json("resonance_results")
    topic_analyses = load_from_json("topic_analyses")
    sentiment_analyses = load_from_json("sentiment_analyses")
    advocacy_analyses = load_from_json("advocacy_analyses")
    geographic_spreads = load_from_json("geographic_spreads")
    demographic_spreads = load_from_json("demographic_spreads")
    intent_analyses = load_from_json("intent_analyses")
    comparison_results = load_from_json("comparison_results")

# Save data on shutdown
@app.on_event("shutdown")
async def shutdown_event():
    """Save data to JSON files on shutdown."""
    save_to_json(brands, "brands")
    save_to_json(resonance_results, "resonance_results")
    save_to_json(topic_analyses, "topic_analyses")
    save_to_json(sentiment_analyses, "sentiment_analyses")
    save_to_json(advocacy_analyses, "advocacy_analyses")
    save_to_json(geographic_spreads, "geographic_spreads")
    save_to_json(demographic_spreads, "demographic_spreads")
    save_to_json(intent_analyses, "intent_analyses")
    save_to_json(comparison_results, "comparison_results")

# API Routes

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Welcome to the Brand Resonance API"}

@app.post("/brands/", response_model=Brand)
async def create_brand(brand: Brand):
    """Create a new brand."""
    if not brand.id:
        brand.id = str(uuid.uuid4())
    
    brands[brand.id] = brand.dict()
    save_to_json(brands, "brands")
    return brand

@app.get("/brands/", response_model=List[Brand])
async def get_brands():
    """Get all brands."""
    return list(brands.values())

@app.get("/brands/{brand_id}", response_model=Brand)
async def get_brand(brand_id: str):
    """Get a specific brand by ID."""
    if brand_id not in brands:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brands[brand_id]

@app.put("/brands/{brand_id}", response_model=Brand)
async def update_brand(brand_id: str, brand: Brand):
    """Update a brand."""
    if brand_id not in brands:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    brand.id = brand_id
    brand.updated_at = datetime.now()
    brands[brand_id] = brand.dict()
    save_to_json(brands, "brands")
    return brand

@app.delete("/brands/{brand_id}")
async def delete_brand(brand_id: str):
    """Delete a brand."""
    if brand_id not in brands:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    del brands[brand_id]
    save_to_json(brands, "brands")
    return {"message": "Brand deleted successfully"}

@app.post("/analyze/", response_model=ResonanceResult)
async def analyze_brand(request: AnalysisRequest):
    """
    Analyze a brand and calculate its resonance score.
    
    This endpoint uses the LLM to generate metrics for the brand and then
    calculates the overall resonance score based on the weighted metrics.
    """
    # Generate metrics using LLM
    metrics = llm_generator.generate_all_metrics(
        request.brand_name,
        request.industry,
        request.additional_context
    )
    
    # Calculate overall score
    overall_score = scorer.calculate_score(metrics)
    
    # Get score category
    category, category_description = scorer.get_score_category(overall_score)
    
    # Create brand if it doesn't exist
    brand_id = None
    for bid, brand_data in brands.items():
        if brand_data["name"].lower() == request.brand_name.lower():
            brand_id = bid
            break
    
    if not brand_id:
        brand = Brand(
            name=request.brand_name,
            industry=request.industry,
            description=request.additional_context
        )
        brand.id = str(uuid.uuid4())
        brands[brand.id] = brand.dict()
        brand_id = brand.id
    
    # Create metric scores
    metric_scores = {}
    for metric_name, score in metrics.items():
        # Get detailed metric info from LLM
        metric_details = getattr(llm_generator, f"generate_{metric_name}")(
            request.brand_name,
            request.industry,
            request.additional_context
        )
        
        metric_scores[metric_name] = {
            "metric_name": metric_name,
            "score": score,
            "reasoning": metric_details["reasoning"],
            "key_insights": metric_details["key_insights"],
            "timestamp": datetime.now().isoformat()
        }
    
    # Create resonance result
    result_id = str(uuid.uuid4())
    result = {
        "id": result_id,
        "brand_id": brand_id,
        "brand_name": request.brand_name,
        "overall_score": overall_score,
        "category": category,
        "category_description": category_description,
        "metrics": metric_scores,
        "timestamp": datetime.now().isoformat(),
        "mode": request.mode
    }
    
    resonance_results[result_id] = result
    save_to_json(resonance_results, "resonance_results")
    
    # Generate and save additional analyses
    await generate_additional_analyses(brand_id, request)
    
    return result

@app.get("/results/", response_model=List[ResonanceResult])
async def get_results(brand_id: Optional[str] = None):
    """Get all resonance results, optionally filtered by brand ID."""
    if brand_id:
        filtered_results = [r for r in resonance_results.values() if r["brand_id"] == brand_id]
        return filtered_results
    return list(resonance_results.values())

@app.get("/results/{result_id}", response_model=ResonanceResult)
async def get_result(result_id: str):
    """Get a specific resonance result by ID."""
    if result_id not in resonance_results:
        raise HTTPException(status_code=404, detail="Result not found")
    return resonance_results[result_id]

@app.get("/topics/{brand_id}", response_model=TopicAnalysis)
async def get_topic_analysis(brand_id: str):
    """Get topic analysis for a brand."""
    if brand_id not in topic_analyses:
        raise HTTPException(status_code=404, detail="Topic analysis not found")
    return topic_analyses[brand_id]

@app.get("/sentiment/{brand_id}", response_model=SentimentDistribution)
async def get_sentiment_analysis(brand_id: str):
    """Get sentiment analysis for a brand."""
    if brand_id not in sentiment_analyses:
        raise HTTPException(status_code=404, detail="Sentiment analysis not found")
    return sentiment_analyses[brand_id]

@app.get("/advocacy/{brand_id}", response_model=AdvocacyAnalysis)
async def get_advocacy_analysis(brand_id: str):
    """Get advocacy analysis for a brand."""
    if brand_id not in advocacy_analyses:
        raise HTTPException(status_code=404, detail="Advocacy analysis not found")
    return advocacy_analyses[brand_id]

@app.get("/geographic/{brand_id}", response_model=GeographicSpread)
async def get_geographic_spread(brand_id: str):
    """Get geographic spread for a brand."""
    if brand_id not in geographic_spreads:
        raise HTTPException(status_code=404, detail="Geographic spread not found")
    return geographic_spreads[brand_id]

@app.get("/demographic/{brand_id}", response_model=DemographicSpread)
async def get_demographic_spread(brand_id: str):
    """Get demographic spread for a brand."""
    if brand_id not in demographic_spreads:
        raise HTTPException(status_code=404, detail="Demographic spread not found")
    return demographic_spreads[brand_id]

@app.get("/intent/{brand_id}", response_model=IntentAnalysis)
async def get_intent_analysis(brand_id: str):
    """Get intent analysis for a brand."""
    if brand_id not in intent_analyses:
        raise HTTPException(status_code=404, detail="Intent analysis not found")
    return intent_analyses[brand_id]

@app.post("/compare/", response_model=ComparisonResult)
async def compare_brands(brand_ids: List[str]):
    """
    Compare multiple brands based on their resonance scores.
    
    This endpoint retrieves the most recent resonance results for each brand
    and creates a comparison of their overall scores and individual metrics.
    """
    if len(brand_ids) < 2:
        raise HTTPException(status_code=400, detail="At least two brands are required for comparison")
    
    # Get the most recent result for each brand
    brand_results = {}
    for brand_id in brand_ids:
        brand_results_list = [r for r in resonance_results.values() if r["brand_id"] == brand_id]
        if not brand_results_list:
            raise HTTPException(status_code=404, detail=f"No results found for brand {brand_id}")
        
        # Sort by timestamp (most recent first)
        brand_results_list.sort(key=lambda x: x["timestamp"], reverse=True)
        brand_results[brand_id] = brand_results_list[0]
    
    # Create comparison result
    brand_names = {brand_id: brands[brand_id]["name"] for brand_id in brand_ids}
    overall_scores = {brand_names[brand_id]: result["overall_score"] for brand_id, result in brand_results.items()}
    
    # Compare metrics
    metric_scores = {}
    for metric_name in scorer.METRIC_WEIGHTS.keys():
        metric_scores[metric_name] = {
            brand_names[brand_id]: result["metrics"][metric_name]["score"] 
            for brand_id, result in brand_results.items()
        }
    
    # Create and save comparison result
    comparison_id = str(uuid.uuid4())
    comparison = {
        "id": comparison_id,
        "brands": list(brand_names.values()),
        "overall_scores": overall_scores,
        "metric_scores": metric_scores,
        "timestamp": datetime.now().isoformat()
    }
    
    comparison_results[comparison_id] = comparison
    save_to_json(comparison_results, "comparison_results")
    
    return comparison

@app.post("/report/")
async def generate_report(config: ReportConfig):
    """
    Generate a report for one or more brands.
    
    This endpoint creates a report based on the specified configuration,
    including the selected brands and analysis components.
    """
    # This would generate a report file in a real implementation
    # For now, we'll just return a success message
    return {"message": "Report generated successfully", "config": config.dict()}

async def generate_additional_analyses(brand_id: str, request: AnalysisRequest):
    """Generate and save additional analyses for a brand."""
    # Topic analysis
    topic_analysis = llm_generator.generate_topic_analysis(
        request.brand_name,
        request.industry,
        request.additional_context
    )
    topic_analysis["brand_id"] = brand_id
    topic_analysis["timestamp"] = datetime.now().isoformat()
    topic_analyses[brand_id] = topic_analysis
    
    # Sentiment analysis
    sentiment_analysis = llm_generator.generate_sentiment_analysis(
        request.brand_name,
        request.industry,
        request.additional_context
    )
    sentiment_analysis["brand_id"] = brand_id
    sentiment_analysis["timestamp"] = datetime.now().isoformat()
    sentiment_analyses[brand_id] = sentiment_analysis
    
    # Advocacy analysis
    advocacy_analysis = llm_generator.generate_advocacy_analysis(
        request.brand_name,
        request.industry,
        request.additional_context
    )
    advocacy_analysis["brand_id"] = brand_id
    advocacy_analysis["timestamp"] = datetime.now().isoformat()
    advocacy_analyses[brand_id] = advocacy_analysis
    
    # Geographic spread
    geographic_spread = llm_generator.generate_geographic_spread(
        request.brand_name,
        request.industry,
        request.additional_context
    )
    geographic_spread["brand_id"] = brand_id
    geographic_spread["timestamp"] = datetime.now().isoformat()
    geographic_spreads[brand_id] = geographic_spread
    
    # Demographic spread
    demographic_spread = llm_generator.generate_demographic_spread(
        request.brand_name,
        request.industry,
        request.additional_context
    )
    demographic_spread["brand_id"] = brand_id
    demographic_spread["timestamp"] = datetime.now().isoformat()
    demographic_spreads[brand_id] = demographic_spread
    
    # Intent analysis
    intent_analysis = llm_generator.generate_intent_analysis(
        request.brand_name,
        request.industry,
        request.additional_context
    )
    intent_analysis["brand_id"] = brand_id
    intent_analysis["timestamp"] = datetime.now().isoformat()
    intent_analyses[brand_id] = intent_analysis
    
    # Save all analyses
    save_to_json(topic_analyses, "topic_analyses")
    save_to_json(sentiment_analyses, "sentiment_analyses")
    save_to_json(advocacy_analyses, "advocacy_analyses")
    save_to_json(geographic_spreads, "geographic_spreads")
    save_to_json(demographic_spreads, "demographic_spreads")
    save_to_json(intent_analyses, "intent_analyses")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
