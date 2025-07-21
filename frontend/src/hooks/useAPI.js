import { useState, useEffect } from 'react';
import { algorithmAPI, executionAPI, handleAPIError } from '../services/api';

export const useAlgorithms = (type = null) => {
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        setLoading(true);
        const response = type 
          ? await algorithmAPI.getByType(type)
          : await algorithmAPI.getAll();
        setAlgorithms(response.data);
        setError(null);
      } catch (err) {
        setError(handleAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAlgorithms();
  }, [type]);

  return { algorithms, loading, error, refetch: () => fetchAlgorithms() };
};

export const useAlgorithmExecution = () => {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);

  const recordExecution = async (executionData) => {
    try {
      setRecording(true);
      const response = await executionAPI.record(executionData);
      setError(null);
      return response.data;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    } finally {
      setRecording(false);
    }
  };

  return { recordExecution, recording, error };
};

export const usePerformanceStats = (type = null) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await executionAPI.getPerformanceStats(type);
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError(handleAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [type]);

  return { stats, loading, error, refetch: () => fetchStats() };
};
