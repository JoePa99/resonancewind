"""
LLM integration module for generating brand resonance metrics using language models.
"""
from typing import Dict, List, Optional, Any
import json
import os
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, validator
import numpy as np
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class MetricResult(BaseModel):
    """Pydantic model for metric results."""
    score: float = Field(..., description="Numeric score between 0 and 100")
    reasoning: str = Field(..., description="Explanation for the score")
    key_insights: List[str] = Field(..., description="Key insights that contributed to the score")
    
    @validator('score')
    def score_must_be_in_range(cls, v):
        if v < 0 or v > 100:
            raise ValueError(f'Score must be between 0 and 100, got {v}')
        return v

class TopicAnalysis(BaseModel):
    """Pydantic model for topic analysis results."""
    topics: List[Dict[str, Any]] = Field(..., description="List of identified topics")
    
class SentimentAnalysis(BaseModel):
    """Pydantic model for sentiment analysis results."""
    distribution: Dict[str, float] = Field(..., description="Distribution of sentiments")
    
class AdvocacyAnalysis(BaseModel):
    """Pydantic model for advocacy analysis results."""
    strength: float = Field(..., description="Overall advocacy strength (0-100)")
    advocates_percentage: float = Field(..., description="Percentage of brand advocates")
    key_advocacy_phrases: List[str] = Field(..., description="Key phrases used by advocates")

class GeographicSpread(BaseModel):
    """Pydantic model for geographic spread analysis."""
    regions: Dict[str, float] = Field(..., description="Distribution across regions")
    
class DemographicSpread(BaseModel):
    """Pydantic model for demographic spread analysis."""
    age_groups: Dict[str, float] = Field(..., description="Distribution across age groups")
    gender: Dict[str, float] = Field(..., description="Distribution across genders")
    income_levels: Dict[str, float] = Field(..., description="Distribution across income levels")

class IntentAnalysis(BaseModel):
    """Pydantic model for intent signal analysis."""
    categories: Dict[str, float] = Field(..., description="Distribution across intent categories")
    key_phrases: Dict[str, List[str]] = Field(..., description="Key phrases for each intent category")


class LLMMetricGenerator:
    """
    Generates brand resonance metrics using large language models.
    """
    
    def __init__(self, model_name: str = "gpt-4", temperature: float = 0.2):
        """
        Initialize the LLM metric generator.
        
        Args:
            model_name: Name of the LLM model to use
            temperature: Temperature parameter for the LLM
        """
        self.llm = ChatOpenAI(
            model_name=model_name,
            temperature=temperature,
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Initialize output parsers
        self.metric_parser = PydanticOutputParser(pydantic_object=MetricResult)
        self.topic_parser = PydanticOutputParser(pydantic_object=TopicAnalysis)
        self.sentiment_parser = PydanticOutputParser(pydantic_object=SentimentAnalysis)
        self.advocacy_parser = PydanticOutputParser(pydantic_object=AdvocacyAnalysis)
        self.geographic_parser = PydanticOutputParser(pydantic_object=GeographicSpread)
        self.demographic_parser = PydanticOutputParser(pydantic_object=DemographicSpread)
        self.intent_parser = PydanticOutputParser(pydantic_object=IntentAnalysis)
    
    def generate_all_metrics(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, float]:
        """
        Generate all five resonance metrics for a given brand.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict[str, float]: Dictionary with scores for all five metrics
        """
        metrics = {}
        
        # Generate each metric
        metrics["conversational_depth"] = self.generate_conversational_depth(brand_name, industry, additional_context)["score"]
        metrics["community_spread"] = self.generate_community_spread(brand_name, industry, additional_context)["score"]
        metrics["emotional_intensity"] = self.generate_emotional_intensity(brand_name, industry, additional_context)["score"]
        metrics["intent_signals"] = self.generate_intent_signals(brand_name, industry, additional_context)["score"]
        metrics["advocacy_language"] = self.generate_advocacy_language(brand_name, industry, additional_context)["score"]
        
        return metrics
    
    def generate_conversational_depth(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate the Conversational Depth metric for a brand.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with score, reasoning, and key insights
        """
        template = """
        You are an expert brand analyst with deep knowledge of consumer behavior and brand conversations.
        
        Analyze the conversational depth for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Conversational Depth measures how substantive and meaningful conversations about a brand are.
        High conversational depth indicates that people engage in detailed, thoughtful discussions about the brand,
        while low depth suggests superficial mentions without meaningful engagement.
        
        Consider factors like:
        - Length and detail of typical brand mentions
        - Complexity and sophistication of discussions
        - Presence of specific product/service details in conversations
        - Whether conversations go beyond surface-level comments
        - Depth of knowledge demonstrated in brand discussions
        
        Based on your expert knowledge and the information provided, generate:
        1. A score from 0-100 for Conversational Depth
        2. Reasoning for this score
        3. Key insights that contributed to this score
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.metric_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.metric_parser.parse(result)
        return parsed_result.dict()
    
    def generate_community_spread(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate the Community Spread metric for a brand.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with score, reasoning, and key insights
        """
        template = """
        You are an expert brand analyst with deep knowledge of consumer behavior and brand communities.
        
        Analyze the community spread for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Community Spread measures how widely a brand is discussed across different communities, platforms, and demographic groups.
        High community spread indicates that the brand has penetrated diverse communities and audiences,
        while low spread suggests the brand is only discussed within limited or niche groups.
        
        Consider factors like:
        - Diversity of platforms where the brand is discussed
        - Variety of demographic groups engaging with the brand
        - Geographic spread of brand conversations
        - Presence across different interest communities
        - Cross-cultural relevance
        
        Based on your expert knowledge and the information provided, generate:
        1. A score from 0-100 for Community Spread
        2. Reasoning for this score
        3. Key insights that contributed to this score
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.metric_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.metric_parser.parse(result)
        return parsed_result.dict()
    
    def generate_emotional_intensity(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate the Emotional Intensity metric for a brand.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with score, reasoning, and key insights
        """
        template = """
        You are an expert brand analyst with deep knowledge of consumer psychology and emotional connections to brands.
        
        Analyze the emotional intensity for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Emotional Intensity measures the strength of emotional reactions and connections people have with a brand.
        High emotional intensity indicates strong emotional responses (positive or negative),
        while low intensity suggests emotional indifference or weak connections.
        
        Consider factors like:
        - Use of emotional language in brand discussions
        - Presence of strong sentiment (positive or negative)
        - Personal stories or experiences shared about the brand
        - Expressions of brand loyalty or attachment
        - Emotional responses to brand actions or communications
        
        Based on your expert knowledge and the information provided, generate:
        1. A score from 0-100 for Emotional Intensity
        2. Reasoning for this score
        3. Key insights that contributed to this score
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.metric_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.metric_parser.parse(result)
        return parsed_result.dict()
    
    def generate_intent_signals(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate the Intent Signals metric for a brand.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with score, reasoning, and key insights
        """
        template = """
        You are an expert brand analyst with deep knowledge of consumer purchase behavior and intent signals.
        
        Analyze the intent signals for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Intent Signals measures indications of purchase intent or consideration in brand conversations.
        High intent signals indicate strong purchase consideration and active buying signals,
        while low signals suggest minimal purchase interest or consideration.
        
        Consider factors like:
        - Expressions of desire to purchase or try products/services
        - Questions about pricing, availability, or features
        - Comparisons with competitor products/services
        - Discussions about purchase experiences
        - Pre-purchase research conversations
        - Post-purchase intent to repurchase
        
        Based on your expert knowledge and the information provided, generate:
        1. A score from 0-100 for Intent Signals
        2. Reasoning for this score
        3. Key insights that contributed to this score
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.metric_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.metric_parser.parse(result)
        return parsed_result.dict()
    
    def generate_advocacy_language(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate the Advocacy Language metric for a brand.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with score, reasoning, and key insights
        """
        template = """
        You are an expert brand analyst with deep knowledge of brand advocacy and consumer recommendations.
        
        Analyze the advocacy language for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Advocacy Language measures how strongly people recommend or advocate for a brand to others.
        High advocacy language indicates strong recommendations and brand championing,
        while low advocacy suggests minimal or negative recommendations.
        
        Consider factors like:
        - Explicit recommendations to others
        - Defending the brand against criticism
        - Sharing positive experiences unprompted
        - Word-of-mouth promotion language
        - Expressions of brand loyalty and commitment
        - Willingness to be associated with the brand
        
        Based on your expert knowledge and the information provided, generate:
        1. A score from 0-100 for Advocacy Language
        2. Reasoning for this score
        3. Key insights that contributed to this score
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.metric_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.metric_parser.parse(result)
        return parsed_result.dict()
    
    def generate_topic_analysis(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate topic analysis for brand conversations.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with topic analysis results
        """
        template = """
        You are an expert brand analyst specializing in conversation analysis and topic modeling.
        
        Analyze the likely conversation topics for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Generate a realistic topic analysis that identifies the main topics discussed in relation to this brand.
        For each topic, provide:
        - Topic name
        - Prevalence (percentage of conversations)
        - Key terms associated with this topic
        - Sample phrases that would appear in this topic
        
        The topics should be realistic and specific to the brand and industry.
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.topic_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.topic_parser.parse(result)
        return parsed_result.dict()
    
    def generate_sentiment_analysis(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate sentiment analysis for brand conversations.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with sentiment analysis results
        """
        template = """
        You are an expert brand analyst specializing in sentiment analysis and emotional response.
        
        Analyze the likely sentiment distribution for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Generate a realistic sentiment distribution that shows how sentiment is distributed in conversations about this brand.
        Provide the percentage breakdown across these sentiment categories:
        - Very Positive
        - Positive
        - Neutral
        - Negative
        - Very Negative
        
        The distribution should be realistic and specific to the brand and industry.
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.sentiment_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.sentiment_parser.parse(result)
        return parsed_result.dict()
    
    def generate_advocacy_analysis(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate advocacy analysis for a brand.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with advocacy analysis results
        """
        template = """
        You are an expert brand analyst specializing in brand advocacy and consumer recommendations.
        
        Analyze the likely advocacy patterns for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Generate a realistic advocacy analysis that shows:
        - Overall advocacy strength (0-100)
        - Percentage of brand advocates among those discussing the brand
        - Key phrases commonly used by brand advocates
        
        The analysis should be realistic and specific to the brand and industry.
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.advocacy_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.advocacy_parser.parse(result)
        return parsed_result.dict()
    
    def generate_geographic_spread(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate geographic spread analysis for a brand.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with geographic spread results
        """
        template = """
        You are an expert brand analyst specializing in global brand presence and regional analysis.
        
        Analyze the likely geographic spread for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Generate a realistic geographic distribution that shows how brand conversations are distributed across different regions.
        Provide the percentage breakdown across major regions (e.g., North America, Europe, Asia, etc.).
        
        The distribution should be realistic and specific to the brand and industry.
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.geographic_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.geographic_parser.parse(result)
        return parsed_result.dict()
    
    def generate_demographic_spread(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate demographic spread analysis for a brand.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with demographic spread results
        """
        template = """
        You are an expert brand analyst specializing in consumer demographics and audience segmentation.
        
        Analyze the likely demographic spread for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Generate a realistic demographic distribution that shows how brand conversations are distributed across:
        - Age groups (e.g., 18-24, 25-34, 35-44, etc.)
        - Gender
        - Income levels
        
        The distribution should be realistic and specific to the brand and industry.
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.demographic_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.demographic_parser.parse(result)
        return parsed_result.dict()
    
    def generate_intent_analysis(self, brand_name: str, industry: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate intent signal analysis for a brand.
        
        Args:
            brand_name: Name of the brand
            industry: Industry of the brand
            additional_context: Additional context about the brand
            
        Returns:
            Dict: Dictionary with intent signal analysis results
        """
        template = """
        You are an expert brand analyst specializing in consumer purchase behavior and intent signals.
        
        Analyze the likely intent signals for the brand {brand_name} in the {industry} industry.
        
        Additional context: {additional_context}
        
        Generate a realistic intent signal analysis that shows the distribution across intent categories:
        - Awareness (just learning about the brand)
        - Consideration (actively researching or comparing)
        - Conversion (ready to purchase or has purchased)
        
        For each category, provide key phrases that would indicate this intent level.
        
        The analysis should be realistic and specific to the brand and industry.
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["brand_name", "industry", "additional_context"],
            partial_variables={"format_instructions": self.intent_parser.get_format_instructions()}
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        result = chain.run(brand_name=brand_name, industry=industry, additional_context=additional_context or "No additional context provided.")
        
        # Parse the result
        parsed_result = self.intent_parser.parse(result)
        return parsed_result.dict()
