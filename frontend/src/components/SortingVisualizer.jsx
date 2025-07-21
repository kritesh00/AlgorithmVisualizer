import React, { useState, useEffect } from "react";
import AlgorithmInfo from "./AlgorithmInfo";
import { useAlgorithmExecution } from "../hooks/useAPI";

export default function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("");
  const [speed, setSpeed] = useState(100);
  const [cancelRequested, setCancelRequested] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);
  
  const { recordExecution } = useAlgorithmExecution();

  // Generate random array
  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < 50; i++) {
      newArray.push(Math.floor(Math.random() * 300) + 10);
    }
    setArray(newArray);
    setComparisons(0);
    setSwaps(0);
    setExecutionTime(0);
  };

  // Cancel sorting
  const cancelSorting = () => {
    setCancelRequested(true);
  };

  // Record execution to backend
  const recordToBackend = async (algorithmName, startTime) => {
    try {
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      setExecutionTime(totalTime);
      
      // Find algorithm ID based on name
      const algorithmMap = {
        "Bubble Sort": 1,
        "Quick Sort": 2,
        "Merge Sort": 3,
        "Radix Sort": 7
      };
      
      await recordExecution({
        algorithm: algorithmMap[algorithmName],
        array_size: array.length,
        execution_time: totalTime,
        comparisons: comparisons,
        swaps: swaps
      });
    } catch (error) {
      console.error('Failed to record execution:', error);
    }
  };

  useEffect(() => {
    generateArray();
  }, []);

  // Bubble Sort Animation
  const bubbleSort = async () => {
    setSorting(true);
    setAlgorithm("Bubble Sort");
    setCancelRequested(false);
    setComparisons(0);
    setSwaps(0);
    const startTime = Date.now();
    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;
    
    for (let i = 0; i < arr.length - 1; i++) {
      if (cancelRequested) break;
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (cancelRequested) break;
        compCount++;
        setComparisons(compCount);
        
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapCount++;
          setSwaps(swapCount);
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
    }
    
    if (!cancelRequested) {
      await recordToBackend("Bubble Sort", startTime);
    }
    
    setSorting(false);
    setAlgorithm("");
    setCancelRequested(false);
  };

  // Quick Sort Animation
  const quickSort = async () => {
    setSorting(true);
    setAlgorithm("Quick Sort");
    setCancelRequested(false);
    setComparisons(0);
    setSwaps(0);
    const startTime = Date.now();
    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;
    
    const quickSortHelper = async (arr, start, end) => {
      if (start >= end || cancelRequested) return;
      
      const index = await partition(arr, start, end);
      await Promise.all([
        quickSortHelper(arr, start, index - 1),
        quickSortHelper(arr, index + 1, end)
      ]);
    };
    
    const partition = async (arr, start, end) => {
      const pivot = arr[end];
      let index = start;
      
      for (let i = start; i < end; i++) {
        if (cancelRequested) return index;
        compCount++;
        setComparisons(compCount);
        
        if (arr[i] < pivot) {
          [arr[i], arr[index]] = [arr[index], arr[i]];
          swapCount++;
          setSwaps(swapCount);
          index++;
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
      
      [arr[index], arr[end]] = [arr[end], arr[index]];
      swapCount++;
      setSwaps(swapCount);
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      return index;
    };
    
    await quickSortHelper(arr, 0, arr.length - 1);
    
    if (!cancelRequested) {
      await recordToBackend("Quick Sort", startTime);
    }
    
    setSorting(false);
    setAlgorithm("");
    setCancelRequested(false);
  };

  // Merge Sort Animation
  const mergeSort = async () => {
    setSorting(true);
    setAlgorithm("Merge Sort");
    setCancelRequested(false);
    setComparisons(0);
    setSwaps(0);
    const startTime = Date.now();
    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;
    
    const mergeSortHelper = async (arr, start, end) => {
      if (start >= end || cancelRequested) return;
      
      const mid = Math.floor((start + end) / 2);
      await mergeSortHelper(arr, start, mid);
      await mergeSortHelper(arr, mid + 1, end);
      await merge(arr, start, mid, end);
    };
    
    const merge = async (arr, start, mid, end) => {
      const left = arr.slice(start, mid + 1);
      const right = arr.slice(mid + 1, end + 1);
      
      let i = 0, j = 0, k = start;
      
      while (i < left.length && j < right.length) {
        if (cancelRequested) return;
        compCount++;
        setComparisons(compCount);
        
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          i++;
        } else {
          arr[k] = right[j];
          j++;
        }
        k++;
        swapCount++;
        setSwaps(swapCount);
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      while (i < left.length) {
        if (cancelRequested) return;
        arr[k] = left[i];
        i++;
        k++;
        swapCount++;
        setSwaps(swapCount);
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      while (j < right.length) {
        if (cancelRequested) return;
        arr[k] = right[j];
        j++;
        k++;
        swapCount++;
        setSwaps(swapCount);
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    };
    
    await mergeSortHelper(arr, 0, arr.length - 1);
    
    if (!cancelRequested) {
      await recordToBackend("Merge Sort", startTime);
    }
    
    setSorting(false);
    setAlgorithm("");
    setCancelRequested(false);
  };

  // Radix Sort Animation
  const radixSort = async () => {
    setSorting(true);
    setAlgorithm("Radix Sort");
    setCancelRequested(false);
    setComparisons(0);
    setSwaps(0);
    const startTime = Date.now();
    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;

    // Find the maximum number to know number of digits
    const max = Math.max(...arr);
    const maxDigits = Math.floor(Math.log10(max)) + 1;

    // Process each digit position
    for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
      if (cancelRequested) break;

      // Create buckets for digits 0-9
      const buckets = Array.from({ length: 10 }, () => []);
      
      // Distribute elements into buckets based on current digit
      for (let i = 0; i < arr.length; i++) {
        if (cancelRequested) break;
        
        const digit = Math.floor(arr[i] / Math.pow(10, digitPlace)) % 10;
        buckets[digit].push(arr[i]);
        compCount++;
        setComparisons(compCount);
        
        // Visual feedback for element being processed
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }

      // Collect elements back from buckets
      let index = 0;
      for (let bucket = 0; bucket < buckets.length; bucket++) {
        if (cancelRequested) break;
        
        for (let i = 0; i < buckets[bucket].length; i++) {
          if (cancelRequested) break;
          
          arr[index] = buckets[bucket][i];
          index++;
          swapCount++;
          setSwaps(swapCount);
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
    }

    if (!cancelRequested) {
      await recordToBackend("Radix Sort", startTime);
    }

    setSorting(false);
    setAlgorithm("");
    setCancelRequested(false);
  };

  return (
    <section id="sorting" className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🟢 Sorting Algorithms</h2>
      
      {/* Algorithm Information */}
      <AlgorithmInfo type="sorting" algorithmName={algorithm || "Radix Sort"} />
      
      {/* Performance Stats */}
      {(comparisons > 0 || swaps > 0 || executionTime > 0) && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h4 className="font-semibold mb-2">Performance Metrics:</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{comparisons}</div>
              <div>Comparisons</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{swaps}</div>
              <div>Swaps</div>
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
          disabled={sorting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate New Array
        </button>
        
        <button
          onClick={bubbleSort}
          disabled={sorting}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Bubble Sort
        </button>
        
        <button
          onClick={quickSort}
          disabled={sorting}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Quick Sort
        </button>
        
        <button
          onClick={mergeSort}
          disabled={sorting}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Merge Sort
        </button>
        
        <button
          onClick={radixSort}
          disabled={sorting}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Radix Sort
        </button>
        
        {sorting && (
          <button
            onClick={cancelSorting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel
          </button>
        )}
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Speed:</label>
          <input
            type="range"
            min="1"
            max="300"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={sorting}
            className="w-20"
          />
          <span className="text-sm">{speed}ms</span>
        </div>
      </div>

      {/* Current Algorithm Display */}
      {algorithm && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <p className="text-center font-semibold">Currently running: {algorithm}</p>
        </div>
      )}

      {/* Visualization */}
      <div className="flex items-end justify-center h-80 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-hidden">
        {array.map((value, index) => (
          <div
            key={index}
            className="bg-blue-500 mx-0.5 transition-all duration-100"
            style={{
              height: `${value}px`,
              width: `${Math.max(800 / array.length - 1, 2)}px`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
