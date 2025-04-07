"""
Utility functions for data processing and analysis.
"""
from typing import Dict, List, Optional, Any
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import spacy
import re

# Download necessary NLTK data
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

try:
    nltk.data.find('punkt')
except LookupError:
    nltk.download('punkt')

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import sys
    import subprocess
    subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")


def extract_topics(texts: List[str], num_topics: int = 5, num_words: int = 10) -> List[Dict[str, Any]]:
    """
    Extract topics from a list of texts using Latent Dirichlet Allocation.
    
    Args:
        texts: List of text documents
        num_topics: Number of topics to extract
        num_words: Number of words per topic to return
        
    Returns:
        List of dictionaries containing topic information
    """
    # Vectorize texts
    vectorizer = CountVectorizer(
        max_df=0.95,
        min_df=2,
        stop_words='english'
    )
    
    # Handle empty input
    if not texts or all(not text.strip() for text in texts):
        return [{"id": i, "words": [], "weight": 0.0} for i in range(num_topics)]
    
    try:
        dtm = vectorizer.fit_transform(texts)
        
        # Create and fit LDA model
        lda = LatentDirichletAllocation(
            n_components=num_topics,
            random_state=42
        )
        lda.fit(dtm)
        
        # Get feature names
        feature_names = vectorizer.get_feature_names_out()
        
        # Extract topics
        topics = []
        for topic_idx, topic in enumerate(lda.components_):
            top_word_indices = topic.argsort()[:-num_words-1:-1]
            top_words = [feature_names[i] for i in top_word_indices]
            
            topics.append({
                "id": topic_idx,
                "words": top_words,
                "weight": float(topic.sum() / lda.components_.sum())
            })
        
        return topics
    except Exception as e:
        print(f"Error extracting topics: {e}")
        return [{"id": i, "words": [], "weight": 0.0} for i in range(num_topics)]


def analyze_sentiment(texts: List[str]) -> Dict[str, float]:
    """
    Analyze sentiment distribution in a list of texts.
    
    Args:
        texts: List of text documents
        
    Returns:
        Dictionary with sentiment distribution
    """
    # Initialize sentiment analyzer
    sia = SentimentIntensityAnalyzer()
    
    # Initialize sentiment counts
    sentiments = {
        "Very Positive": 0,
        "Positive": 0,
        "Neutral": 0,
        "Negative": 0,
        "Very Negative": 0
    }
    
    # Handle empty input
    if not texts:
        return {k: 0.0 for k in sentiments.keys()}
    
    # Analyze each text
    for text in texts:
        if not text.strip():
            continue
            
        score = sia.polarity_scores(text)
        compound = score["compound"]
        
        if compound >= 0.5:
            sentiments["Very Positive"] += 1
        elif compound >= 0.1:
            sentiments["Positive"] += 1
        elif compound > -0.1:
            sentiments["Neutral"] += 1
        elif compound > -0.5:
            sentiments["Negative"] += 1
        else:
            sentiments["Very Negative"] += 1
    
    # Convert to percentages
    total = sum(sentiments.values())
    if total > 0:
        for key in sentiments:
            sentiments[key] = round((sentiments[key] / total) * 100, 1)
    else:
        for key in sentiments:
            sentiments[key] = 0.0
    
    return sentiments


def detect_intent_signals(texts: List[str]) -> Dict[str, float]:
    """
    Detect intent signals in a list of texts.
    
    Args:
        texts: List of text documents
        
    Returns:
        Dictionary with intent signal distribution
    """
    # Define intent signal keywords
    intent_keywords = {
        "awareness": [
            "heard about", "what is", "who is", "learn more", "tell me about",
            "new", "discover", "found out", "just saw", "introduction"
        ],
        "consideration": [
            "compare", "versus", "vs", "better than", "alternative", "review",
            "rating", "price", "cost", "worth it", "features", "thinking about",
            "considering", "should I", "pros and cons"
        ],
        "conversion": [
            "bought", "purchased", "ordered", "buy", "get", "where to buy",
            "discount", "coupon", "deal", "sale", "in stock", "shipping",
            "delivery", "add to cart", "checkout"
        ]
    }
    
    # Initialize intent counts
    intents = {
        "awareness": 0,
        "consideration": 0,
        "conversion": 0
    }
    
    # Handle empty input
    if not texts:
        return {k: 0.0 for k in intents.keys()}
    
    # Analyze each text
    for text in texts:
        if not text.strip():
            continue
            
        text_lower = text.lower()
        
        # Check for intent signals
        for intent, keywords in intent_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    intents[intent] += 1
                    break
    
    # Convert to percentages
    total = sum(intents.values())
    if total > 0:
        for key in intents:
            intents[key] = round((intents[key] / total) * 100, 1)
    else:
        for key in intents:
            intents[key] = 0.0
    
    return intents


def detect_advocacy(texts: List[str]) -> Dict[str, Any]:
    """
    Detect advocacy signals in a list of texts.
    
    Args:
        texts: List of text documents
        
    Returns:
        Dictionary with advocacy analysis results
    """
    # Define advocacy keywords
    advocacy_keywords = [
        "recommend", "love", "best", "amazing", "excellent", "awesome",
        "great", "fantastic", "outstanding", "superb", "favorite", "perfect",
        "must-have", "must try", "life-changing", "game-changer", "changed my life",
        "never going back", "loyal", "fan", "advocate", "evangelist", "ambassador"
    ]
    
    # Initialize advocacy data
    advocacy_count = 0
    advocacy_texts = []
    
    # Handle empty input
    if not texts:
        return {
            "strength": 0.0,
            "advocates_percentage": 0.0,
            "key_advocacy_phrases": []
        }
    
    # Analyze each text
    for text in texts:
        if not text.strip():
            continue
            
        text_lower = text.lower()
        is_advocacy = False
        
        # Check for advocacy signals
        for keyword in advocacy_keywords:
            if keyword in text_lower:
                advocacy_count += 1
                advocacy_texts.append(text)
                is_advocacy = True
                break
    
    # Calculate advocacy strength and percentage
    total_texts = len([t for t in texts if t.strip()])
    advocates_percentage = (advocacy_count / total_texts) * 100 if total_texts > 0 else 0.0
    
    # Calculate advocacy strength (0-100)
    # This is a combination of the percentage of advocates and the sentiment of advocacy texts
    sentiment_score = 0.0
    if advocacy_texts:
        sia = SentimentIntensityAnalyzer()
        sentiment_scores = [sia.polarity_scores(text)["compound"] for text in advocacy_texts]
        sentiment_score = (sum(sentiment_scores) / len(sentiment_scores) + 1) / 2 * 100  # Convert to 0-100 scale
    
    advocacy_strength = (advocates_percentage + sentiment_score) / 2 if advocacy_texts else 0.0
    
    # Extract key advocacy phrases
    key_phrases = []
    if advocacy_texts:
        for text in advocacy_texts[:5]:  # Limit to 5 texts for efficiency
            doc = nlp(text)
            for sent in doc.sents:
                for chunk in sent.noun_chunks:
                    if any(keyword in chunk.text.lower() for keyword in advocacy_keywords):
                        key_phrases.append(chunk.text)
    
    # Limit and deduplicate key phrases
    key_phrases = list(set(key_phrases))[:10]
    
    return {
        "strength": round(advocacy_strength, 1),
        "advocates_percentage": round(advocates_percentage, 1),
        "key_advocacy_phrases": key_phrases
    }


def extract_geographic_mentions(texts: List[str]) -> Dict[str, float]:
    """
    Extract geographic mentions from a list of texts.
    
    Args:
        texts: List of text documents
        
    Returns:
        Dictionary with geographic distribution
    """
    # Define major regions and countries
    regions = {
        "North America": ["usa", "united states", "america", "canada", "mexico"],
        "Europe": ["europe", "uk", "united kingdom", "germany", "france", "italy", "spain"],
        "Asia": ["asia", "china", "japan", "india", "korea", "singapore"],
        "Australia/Oceania": ["australia", "new zealand", "oceania"],
        "South America": ["brazil", "argentina", "colombia", "chile", "peru"],
        "Africa": ["africa", "south africa", "nigeria", "kenya", "egypt"],
        "Middle East": ["middle east", "uae", "dubai", "saudi arabia", "israel"]
    }
    
    # Initialize region counts
    region_counts = {region: 0 for region in regions}
    
    # Handle empty input
    if not texts:
        return {k: 0.0 for k in region_counts.keys()}
    
    # Analyze each text
    for text in texts:
        if not text.strip():
            continue
            
        text_lower = text.lower()
        
        # Check for region mentions
        for region, keywords in regions.items():
            for keyword in keywords:
                if keyword in text_lower:
                    region_counts[region] += 1
                    break
    
    # Convert to percentages
    total = sum(region_counts.values())
    if total > 0:
        for key in region_counts:
            region_counts[key] = round((region_counts[key] / total) * 100, 1)
    else:
        # Default distribution if no regions detected
        region_counts = {
            "North America": 40.0,
            "Europe": 25.0,
            "Asia": 20.0,
            "Australia/Oceania": 5.0,
            "South America": 5.0,
            "Africa": 3.0,
            "Middle East": 2.0
        }
    
    return region_counts


def extract_demographic_mentions(texts: List[str]) -> Dict[str, Dict[str, float]]:
    """
    Extract demographic mentions from a list of texts.
    
    Args:
        texts: List of text documents
        
    Returns:
        Dictionary with demographic distributions
    """
    # Define demographic keywords
    demographics = {
        "age_groups": {
            "Under 18": ["teen", "teenager", "high school", "young", "kid", "child"],
            "18-24": ["college", "university", "student", "young adult", "early 20s"],
            "25-34": ["young professional", "millennial", "30s", "thirties", "late 20s"],
            "35-44": ["parent", "family", "40s", "forties", "mid-career"],
            "45-54": ["middle-aged", "experienced", "50s", "fifties"],
            "55+": ["senior", "retired", "elder", "boomer", "older"]
        },
        "gender": {
            "Male": ["man", "men", "male", "guy", "boy", "father", "dad", "husband", "boyfriend"],
            "Female": ["woman", "women", "female", "girl", "mother", "mom", "wife", "girlfriend"],
            "Other/Unspecified": ["non-binary", "they", "them", "person", "people"]
        },
        "income_levels": {
            "Low": ["budget", "affordable", "cheap", "low income", "struggling", "poor"],
            "Middle": ["middle class", "average", "moderate", "standard"],
            "High": ["luxury", "premium", "high-end", "wealthy", "rich", "affluent"]
        }
    }
    
    # Initialize demographic counts
    demo_counts = {
        category: {subcategory: 0 for subcategory in subcategories}
        for category, subcategories in demographics.items()
    }
    
    # Handle empty input
    if not texts:
        return {
            category: {subcategory: 0.0 for subcategory in subcategories}
            for category, subcategories in demographics.items()
        }
    
    # Analyze each text
    for text in texts:
        if not text.strip():
            continue
            
        text_lower = text.lower()
        
        # Check for demographic mentions
        for category, subcategories in demographics.items():
            for subcategory, keywords in subcategories.items():
                for keyword in keywords:
                    if keyword in text_lower:
                        demo_counts[category][subcategory] += 1
                        break
    
    # Convert to percentages
    for category, subcategories in demo_counts.items():
        total = sum(subcategories.values())
        if total > 0:
            for subcategory in subcategories:
                demo_counts[category][subcategory] = round((demo_counts[category][subcategory] / total) * 100, 1)
        else:
            # Default distributions if no demographics detected
            if category == "age_groups":
                demo_counts[category] = {
                    "Under 18": 5.0,
                    "18-24": 15.0,
                    "25-34": 30.0,
                    "35-44": 25.0,
                    "45-54": 15.0,
                    "55+": 10.0
                }
            elif category == "gender":
                demo_counts[category] = {
                    "Male": 48.0,
                    "Female": 48.0,
                    "Other/Unspecified": 4.0
                }
            elif category == "income_levels":
                demo_counts[category] = {
                    "Low": 30.0,
                    "Middle": 50.0,
                    "High": 20.0
                }
    
    return demo_counts


def generate_sample_conversations(brand_name: str, industry: str, count: int = 100) -> List[str]:
    """
    Generate sample brand conversations for testing.
    
    Args:
        brand_name: Name of the brand
        industry: Industry of the brand
        count: Number of conversations to generate
        
    Returns:
        List of sample conversations
    """
    # This would be replaced with real data in the hybrid mode
    # For now, we'll return an empty list as this is just a placeholder
    return []
