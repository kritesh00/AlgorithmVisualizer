import React, { useState, useEffect } from "react";
import AlgorithmInfo from "./AlgorithmInfo";
import { useAlgorithmExecution } from "../hooks/useAPI";

export default function SearchingVisualizer() {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState(50);
  const [searching, setSearching] = useState(false);
  const [algorithm, setAlgorithm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [speed, setSpeed] = useState(200);
  const [cancelRequested, setCancelRequested] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);
  
  const { recordExecution } = useAlgorithmExecution();

  // Generate sorted array for binary search
  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < 20; i++) {
      newArray.push(i * 5 + 10);
    }
    setArray(newArray);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setExecutionTime(0);
  };

  useEffect(() => {
    generateArray();
  }, []);

  // Record execution to backend
  const recordToBackend = async (algorithmName, startTime, compCount) => {
    try {
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      setExecutionTime(totalTime);
      
      // Algorithm mapping for searching algorithms
      const algorithmMap = {
        "Linear Search": 4,
        "Binary Search": 5
      };
      
      await recordExecution({
        algorithm: algorithmMap[algorithmName],
        array_size: array.length,
        execution_time: totalTime,
        comparisons: compCount,
        swaps: 0 // Searching doesn't involve swaps
      });
    } catch (error) {
      console.error('Failed to record execution:', error);
    }
  };

  // Cancel searching
  const cancelSearching = () => {
    setCancelRequested(true);
  };

  // Linear Search Animation
  const linearSearch = async () => {
    setSearching(true);
    setAlgorithm("Linear Search");
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setCancelRequested(false);
    setComparisons(0);
    const startTime = Date.now();
    let compCount = 0;
    
    for (let i = 0; i < array.length; i++) {
      if (cancelRequested) break;
      setCurrentIndex(i);
      compCount++;
      setComparisons(compCount);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (array[i] === target) {
        setFoundIndex(i);
        break;
      }
    }
    
    if (!cancelRequested) {
      await recordToBackend("Linear Search", startTime, compCount);
    }
    
    setSearching(false);
    setAlgorithm("");
    setCurrentIndex(-1);
    setCancelRequested(false);
  };

  // Binary Search Animation
  const binarySearch = async () => {
    setSearching(true);
    setAlgorithm("Binary Search");
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setCancelRequested(false);
    setComparisons(0);
    const startTime = Date.now();
    let compCount = 0;
    
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right && !cancelRequested) {
      const mid = Math.floor((left + right) / 2);
      setCurrentIndex(mid);
      compCount++;
      setComparisons(compCount);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (array[mid] === target) {
        setFoundIndex(mid);
        break;
      } else if (array[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    if (!cancelRequested) {
      await recordToBackend("Binary Search", startTime, compCount);
    }
    
    setSearching(false);
    setAlgorithm("");
    setCurrentIndex(-1);
    setCancelRequested(false);
  };

  const resetSearch = () => {
    setCurrentIndex(-1);
    setFoundIndex(-1);
  };

  return (
    <section id="searching" className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🔍 Searching Algorithms</h2>
      
      {/* Algorithm Information */}
      <AlgorithmInfo type="searching" algorithmName={algorithm || "Linear Search"} />
      
      {/* Performance Stats */}
      {(comparisons > 0 || executionTime > 0) && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h4 className="font-semibold mb-2">Performance Metrics:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{comparisons}</div>
              <div>Comparisons</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{executionTime}ms</div>
              <div>Execution Time</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <button
          onClick={generateArray}
          disabled={searching}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate New Array
        </button>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Target:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={searching}
            className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
            min="0"
            max="200"
          />
        </div>
        
        <button
          onClick={resetSearch}
          disabled={searching}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Speed:</label>
          <input
            type="range"
            min="50"
            max="500"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={searching}
            className="w-20"
          />
          <span className="text-sm">{speed}ms</span>
        </div>
      </div>

      {/* Algorithm Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={linearSearch}
          disabled={searching}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Linear Search
        </button>
        
        <button
          onClick={binarySearch}
          disabled={searching}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Binary Search
        </button>
        
        {searching && (
          <button
            onClick={cancelSearching}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Current Algorithm Display */}
      {algorithm && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <p className="text-center font-semibold">Currently running: {algorithm}</p>
        </div>
      )}

      {/* Result Display */}
      {foundIndex !== -1 && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
          <p className="text-center font-semibold">Found target {target} at index {foundIndex}!</p>
        </div>
      )}

      {/* Visualization */}
      <div className="flex items-center justify-center gap-2 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto">
        {array.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-white transition-all duration-300 ${
                index === foundIndex
                  ? 'bg-green-500 scale-110'
                  : index === currentIndex
                  ? 'bg-yellow-500 scale-105'
                  : 'bg-blue-500'
              }`}
            >
              {value}
            </div>
            <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              {index}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Array values are shown above with their indices below
      </div>
    </section>
  );
}
