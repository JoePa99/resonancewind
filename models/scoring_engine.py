"""
Scoring engine for calculating brand resonance scores based on weighted metrics.
"""
from typing import Dict, List, Optional, Tuple
import numpy as np


class ResonanceScorer:
    """
    Calculates a Resonance Score (0-100) for brands based on five weighted metrics:
    - Conversational Depth (10%)
    - Community Spread (15%)
    - Emotional Intensity (20%)
    - Intent Signals (30%)
    - Advocacy Language (25%)
    """

    # Define metric weights
    METRIC_WEIGHTS = {
        "conversational_depth": 0.10,
        "community_spread": 0.15,
        "emotional_intensity": 0.20,
        "intent_signals": 0.30,
        "advocacy_language": 0.25
    }

    def __init__(self):
        """Initialize the ResonanceScorer."""
        # Validate that weights sum to 1.0
        total_weight = sum(self.METRIC_WEIGHTS.values())
        if not np.isclose(total_weight, 1.0):
            raise ValueError(f"Metric weights must sum to 1.0, got {total_weight}")

    def calculate_score(self, metrics: Dict[str, float]) -> float:
        """
        Calculate the overall resonance score based on the provided metrics.
        
        Args:
            metrics: Dictionary containing scores for each metric (0-100)
            
        Returns:
            float: Overall resonance score (0-100)
        """
        # Validate input metrics
        self._validate_metrics(metrics)
        
        # Calculate weighted score
        weighted_score = 0.0
        for metric_name, weight in self.METRIC_WEIGHTS.items():
            if metric_name in metrics:
                metric_score = metrics[metric_name]
                weighted_score += metric_score * weight
        
        # Round to 1 decimal place
        return round(weighted_score, 1)
    
    def _validate_metrics(self, metrics: Dict[str, float]) -> None:
        """
        Validate the input metrics.
        
        Args:
            metrics: Dictionary containing scores for each metric
            
        Raises:
            ValueError: If metrics are invalid
        """
        # Check for missing metrics
        for metric_name in self.METRIC_WEIGHTS.keys():
            if metric_name not in metrics:
                raise ValueError(f"Missing required metric: {metric_name}")
        
        # Check for invalid metric values
        for metric_name, score in metrics.items():
            if not isinstance(score, (int, float)):
                raise ValueError(f"Metric {metric_name} must be a number, got {type(score)}")
            
            if score < 0 or score > 100:
                raise ValueError(f"Metric {metric_name} must be between 0 and 100, got {score}")

    def get_metric_breakdown(self, metrics: Dict[str, float]) -> List[Dict[str, any]]:
        """
        Get a breakdown of each metric's contribution to the overall score.
        
        Args:
            metrics: Dictionary containing scores for each metric
            
        Returns:
            List[Dict]: List of dictionaries with metric details
        """
        breakdown = []
        for metric_name, weight in self.METRIC_WEIGHTS.items():
            score = metrics.get(metric_name, 0)
            contribution = score * weight
            percentage = (contribution / self.calculate_score(metrics)) * 100 if self.calculate_score(metrics) > 0 else 0
            
            breakdown.append({
                "name": metric_name,
                "score": score,
                "weight": weight,
                "contribution": contribution,
                "percentage": round(percentage, 1)
            })
        
        # Sort by contribution (highest first)
        breakdown.sort(key=lambda x: x["contribution"], reverse=True)
        return breakdown
    
    def get_score_category(self, score: float) -> Tuple[str, str]:
        """
        Get the category and description for a given resonance score.
        
        Args:
            score: Resonance score (0-100)
            
        Returns:
            Tuple[str, str]: Category name and description
        """
        if score >= 90:
            return ("Iconic", "Brand has achieved cultural icon status with extremely high resonance")
        elif score >= 80:
            return ("Leading", "Brand has strong resonance across all metrics")
        elif score >= 70:
            return ("Strong", "Brand has above-average resonance with some standout metrics")
        elif score >= 60:
            return ("Established", "Brand has solid resonance with room for improvement")
        elif score >= 50:
            return ("Developing", "Brand has moderate resonance with significant growth potential")
        elif score >= 40:
            return ("Emerging", "Brand has begun to establish resonance but needs development")
        elif score >= 30:
            return ("Weak", "Brand has limited resonance with substantial challenges")
        elif score >= 20:
            return ("Struggling", "Brand has minimal resonance and requires major intervention")
        else:
            return ("Critical", "Brand has extremely low resonance and needs complete rethinking")
