import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const useAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [priority, setPriority] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingWeekly, setLoadingWeekly] = useState(true);
  const [loadingPriority, setLoadingPriority] = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setError(null);
    setLoadingSummary(true);
    setLoadingWeekly(true);
    setLoadingPriority(true);
    setLoadingMonthly(true);

    try {
      const [summaryRes, weeklyRes, priorityRes, monthlyRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/weekly'),
        api.get('/analytics/priority'),
        api.get('/analytics/monthly'),
      ]);

      setSummary(summaryRes.data);
      setWeekly(weeklyRes.data.weekly || []);
      setPriority(priorityRes.data.priority || []);
      setMonthly(monthlyRes.data.monthly || []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || fetchError.message || 'Unable to load analytics data');
    } finally {
      setLoadingSummary(false);
      setLoadingWeekly(false);
      setLoadingPriority(false);
      setLoadingMonthly(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    summary,
    weekly,
    priority,
    monthly,
    loadingSummary,
    loadingWeekly,
    loadingPriority,
    loadingMonthly,
    loading: loadingSummary || loadingWeekly || loadingPriority || loadingMonthly,
    error,
    refetch: fetchAnalytics,
  };
};

export default useAnalytics;
