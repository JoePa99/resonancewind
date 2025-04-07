"""
Data models for the brand resonance application.
"""
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime


class Brand(BaseModel):
    """Model representing a brand."""
    id: Optional[str] = None
    name: str
    industry: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class MetricScore(BaseModel):
    """Model representing a score for a single metric."""
    metric_name: str
    score: float
    reasoning: str
    key_insights: List[str]
    timestamp: datetime = Field(default_factory=datetime.now)


class ResonanceResult(BaseModel):
    """Model representing the complete resonance analysis result for a brand."""
    id: Optional[str] = None
    brand_id: str
    brand_name: str
    overall_score: float
    category: str
    category_description: str
    metrics: Dict[str, MetricScore]
    timestamp: datetime = Field(default_factory=datetime.now)
    mode: str = "ai"  # "ai" or "hybrid"


class Topic(BaseModel):
    """Model representing a topic in brand conversations."""
    name: str
    prevalence: float  # Percentage of conversations
    key_terms: List[str]
    sample_phrases: List[str]


class TopicAnalysis(BaseModel):
    """Model representing topic analysis results."""
    brand_id: str
    topics: List[Topic]
    timestamp: datetime = Field(default_factory=datetime.now)


class SentimentDistribution(BaseModel):
    """Model representing sentiment distribution in brand conversations."""
    brand_id: str
    distribution: Dict[str, float]  # Sentiment category -> percentage
    timestamp: datetime = Field(default_factory=datetime.now)


class AdvocacyAnalysis(BaseModel):
    """Model representing advocacy analysis for a brand."""
    brand_id: str
    strength: float  # Overall advocacy strength (0-100)
    advocates_percentage: float  # Percentage of brand advocates
    key_advocacy_phrases: List[str]
    timestamp: datetime = Field(default_factory=datetime.now)


class GeographicSpread(BaseModel):
    """Model representing geographic spread of brand conversations."""
    brand_id: str
    regions: Dict[str, float]  # Region -> percentage
    timestamp: datetime = Field(default_factory=datetime.now)


class DemographicSpread(BaseModel):
    """Model representing demographic spread of brand conversations."""
    brand_id: str
    age_groups: Dict[str, float]  # Age group -> percentage
    gender: Dict[str, float]  # Gender -> percentage
    income_levels: Dict[str, float]  # Income level -> percentage
    timestamp: datetime = Field(default_factory=datetime.now)


class IntentAnalysis(BaseModel):
    """Model representing intent signal analysis for a brand."""
    brand_id: str
    categories: Dict[str, float]  # Intent category -> percentage
    key_phrases: Dict[str, List[str]]  # Intent category -> key phrases
    timestamp: datetime = Field(default_factory=datetime.now)


class AnalysisRequest(BaseModel):
    """Model representing a request for brand resonance analysis."""
    brand_name: str
    industry: str
    additional_context: Optional[str] = None
    mode: str = "ai"  # "ai" or "hybrid"


class ComparisonResult(BaseModel):
    """Model representing a comparison between multiple brands."""
    id: Optional[str] = None
    brands: List[str]
    overall_scores: Dict[str, float]
    metric_scores: Dict[str, Dict[str, float]]
    timestamp: datetime = Field(default_factory=datetime.now)


class UserSettings(BaseModel):
    """Model representing user settings."""
    id: Optional[str] = None
    default_mode: str = "ai"  # "ai" or "hybrid"
    default_industry: Optional[str] = None
    api_keys: Dict[str, str] = {}  # Service name -> API key
    theme: str = "light"  # "light" or "dark"
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class ReportConfig(BaseModel):
    """Model representing report configuration."""
    brand_ids: List[str]
    include_metrics: bool = True
    include_topic_analysis: bool = True
    include_sentiment_analysis: bool = True
    include_advocacy_analysis: bool = True
    include_geographic_spread: bool = False
    include_demographic_spread: bool = False
    include_intent_analysis: bool = True
    comparison_mode: bool = False
    format: str = "pdf"  # "pdf", "csv", "json"
