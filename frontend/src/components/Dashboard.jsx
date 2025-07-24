import React from 'react';
import { usePerformanceStats } from '../hooks/useAPI';
import { useDashboard } from '../contexts/DashboardContext';

export default function Dashboard() {
  const { refreshTrigger } = useDashboard();
  const { stats, loading, error } = usePerformanceStats(refreshTrigger);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">📊 Performance Dashboard</h2>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">📊 Performance Dashboard</h2>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">
            Unable to connect to backend: {error}
          </p>
          <p className="text-sm mt-2 text-gray-600">
            Make sure the backend server is running and accessible
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">📊 Performance Dashboard</h2>
      
      {stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="font-bold text-lg capitalize mb-2">{stat.algorithm_type}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Executions:</span>
                  <span className="font-semibold">{stat.total_executions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Time:</span>
                  <span className="font-semibold">{Math.round(stat.avg_execution_time || 0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Comparisons:</span>
                  <span className="font-semibold">{Math.round(stat.avg_comparisons || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Swaps:</span>
                  <span className="font-semibold">{Math.round(stat.avg_swaps || 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-green-600">
            ✅ Backend connected successfully! Run some algorithms to see performance statistics.
          </p>
        </div>
      )}
    </div>
  );
}
