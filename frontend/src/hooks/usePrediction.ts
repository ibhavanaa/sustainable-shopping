import { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { predictionService } from '../services/predictionService';
import { EcoPrediction } from '../types/Product';

export const usePrediction = (product: Product | null) => {
  const [prediction, setPrediction] = useState<EcoPrediction | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) {
      setPrediction(null);
      setRecommendations([]);
      return;
    }

    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await predictionService.predictEcoFriendlyFromProduct(product);
        setPrediction({ ecoLabel: result.ecoLabel, confidence: result.confidence });
        setRecommendations(result.recommendations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Prediction failed');
        // Fallback to CSV EcoLabel
        setPrediction({
          ecoLabel: product.EcoLabel,
          confidence: 0.8
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [product]);

  return { prediction, recommendations, loading, error };
};