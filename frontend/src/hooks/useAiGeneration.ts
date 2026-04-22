import { useState } from 'react';
import api from '../utils/api';
import { GenerateRequest, ApiResponse, GenerateResponse } from '../types';

export function useAiGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (prompt: string, existingCode?: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<ApiResponse<GenerateResponse>>(
        '/api/generation',
        { prompt, existingCode } as GenerateRequest
      );

      if (response.data.success && response.data.data) {
        setLoading(false);
        return response.data.data.code;
      } else {
        setError(response.data.error || 'Generation failed');
        setLoading(false);
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Generation failed';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return { generate, loading, error };
}
