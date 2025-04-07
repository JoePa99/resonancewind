"""
Test script for the Brand Resonance App.
"""
import os
import requests
import json
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_URL = "http://localhost:8000"

def test_api_connection():
    """Test connection to the API."""
    try:
        response = requests.get(f"{API_URL}/")
        if response.status_code == 200:
            print("✅ API connection successful")
            return True
        else:
            print(f"❌ API connection failed with status code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ API connection failed - server not running")
        return False

def test_create_brand():
    """Test creating a brand."""
    brand_data = {
        "name": "Test Brand",
        "industry": "Technology",
        "description": "A test brand for verification"
    }
    
    try:
        response = requests.post(f"{API_URL}/brands/", json=brand_data)
        if response.status_code == 200:
            print("✅ Brand creation successful")
            return response.json()
        else:
            print(f"❌ Brand creation failed with status code {response.status_code}")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Brand creation failed - server not running")
        return None

def test_analyze_brand():
    """Test analyzing a brand."""
    analysis_data = {
        "brand_name": "Test Brand",
        "industry": "Technology",
        "additional_context": "A test brand for verification",
        "mode": "ai"
    }
    
    try:
        print("⏳ Analyzing brand (this may take a minute)...")
        response = requests.post(f"{API_URL}/analyze/", json=analysis_data)
        if response.status_code == 200:
            print("✅ Brand analysis successful")
            return response.json()
        else:
            print(f"❌ Brand analysis failed with status code {response.status_code}")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Brand analysis failed - server not running")
        return None

def verify_openai_key():
    """Verify that the OpenAI API key is set."""
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        print("✅ OpenAI API key is set")
        return True
    else:
        print("❌ OpenAI API key is not set - AI features will not work")
        return False

def main():
    """Run all tests."""
    print("Running Brand Resonance App tests...\n")
    
    # Verify OpenAI API key
    verify_openai_key()
    print()
    
    # Test API connection
    if not test_api_connection():
        print("\nPlease make sure the API server is running with:")
        print("python run.py --api-only")
        return
    
    print()
    
    # Test creating a brand
    brand = test_create_brand()
    if not brand:
        return
    
    print()
    
    # Test analyzing a brand
    if verify_openai_key():
        result = test_analyze_brand()
        if result:
            print("\nAnalysis result:")
            print(f"Overall score: {result['overall_score']}")
            print(f"Category: {result['category']}")
            print("\nMetric scores:")
            for metric, data in result['metrics'].items():
                print(f"- {metric}: {data['score']}")
    
    print("\nAll tests completed!")

if __name__ == "__main__":
    main()
