import React, { useState } from 'react';
import { useAlgorithms } from '../hooks/useAPI';

export default function AlgorithmInfo({ type, algorithmName }) {
  const { algorithms, loading, error } = useAlgorithms(type);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [showCode, setShowCode] = useState(false);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p className="text-center">Loading algorithm information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
        <p className="text-center text-red-600 dark:text-red-400">
          Error loading algorithms: {error}
        </p>
      </div>
    );
  }

  const currentAlgorithm = algorithms.find(alg => 
    alg.name.toLowerCase() === algorithmName?.toLowerCase()
  ) || algorithms[0];

  if (!currentAlgorithm) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      {/* Algorithm Selector */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label className="font-medium">Algorithm Info:</label>
        <select
          value={selectedAlgorithm?.id || currentAlgorithm.id}
          onChange={(e) => {
            const selected = algorithms.find(alg => alg.id === parseInt(e.target.value));
            setSelectedAlgorithm(selected);
          }}
          className="px-3 py-1 border rounded dark:bg-gray-600 dark:border-gray-500"
        >
          {algorithms.map(algorithm => (
            <option key={algorithm.id} value={algorithm.id}>
              {algorithm.name}
            </option>
          ))}
        </select>
        
        <button
          onClick={() => setShowCode(!showCode)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {showCode ? 'Hide Code' : 'Show Code'}
        </button>
      </div>

      {/* Algorithm Details */}
      {(() => {
        const displayAlgorithm = selectedAlgorithm || currentAlgorithm;
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-lg">{displayAlgorithm.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {displayAlgorithm.description}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Time Complexity:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">
                    {displayAlgorithm.complexity_time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Space Complexity:</span>
                  <span className="text-green-600 dark:text-green-400 font-mono">
                    {displayAlgorithm.complexity_space}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span className="capitalize">{displayAlgorithm.algorithm_type}</span>
                </div>
              </div>
            </div>

            {/* Code Sample */}
            {showCode && displayAlgorithm.code_sample && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">Code Sample:</h5>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{displayAlgorithm.code_sample}</code>
                </pre>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
