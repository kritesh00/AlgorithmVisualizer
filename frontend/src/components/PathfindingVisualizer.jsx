import React, { useState, useEffect, useCallback } from "react";
import AlgorithmInfo from "./AlgorithmInfo";
import { useAlgorithmExecution } from "../hooks/useAPI";

export default function PathfindingVisualizer() {
  const ROWS = 15;
  const COLS = 25;
  const START_ROW = 7;
  const START_COL = 5;
  const END_ROW = 7;
  const END_COL = 20;

  const [grid, setGrid] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState("wall"); // wall or clear
  const [speed, setSpeed] = useState(50);
  const [cancelRequested, setCancelRequested] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [nodesVisited, setNodesVisited] = useState(0);
  
  const { recordExecution } = useAlgorithmExecution();

  // Initialize grid
  const createGrid = useCallback(() => {
    const newGrid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push({
          row,
          col,
          isStart: row === START_ROW && col === START_COL,
          isEnd: row === END_ROW && col === END_COL,
          isWall: false,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousNode: null,
        });
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  }, []);

  useEffect(() => {
    setGrid(createGrid());
  }, [createGrid]);

  // Clear grid (keep walls)
  const clearPath = () => {
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null,
      }))
    );
    setGrid(newGrid);
    setNodesVisited(0);
    setExecutionTime(0);
  };

  // Record execution to backend
  const recordToBackend = async (algorithmName, startTime, visitedCount, gridSize) => {
    try {
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      setExecutionTime(totalTime);
      
      // Algorithm mapping for pathfinding algorithms
      const algorithmMap = {
        "Dijkstra's Algorithm": 6
      };
      
      await recordExecution({
        algorithm: algorithmMap[algorithmName],
        array_size: gridSize, // Use grid size instead of array size
        execution_time: totalTime,
        comparisons: visitedCount, // Use nodes visited as comparisons
        swaps: 0 // Pathfinding doesn't involve swaps
      });
    } catch (error) {
      console.error('Failed to record execution:', error);
    }
  };

  // Clear walls
  const clearWalls = () => {
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isWall: false,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null,
      }))
    );
    setGrid(newGrid);
  };

  // Cancel pathfinding
  const cancelPathfinding = () => {
    setCancelRequested(true);
  };

  // Mouse events for drawing walls
  const handleMouseDown = (row, col) => {
    if (isRunning) return;
    const node = grid[row][col];
    if (node.isStart || node.isEnd) return;
    
    const newDrawingMode = node.isWall ? "clear" : "wall";
    setDrawingMode(newDrawingMode);
    setIsDrawing(true);
    toggleWall(row, col, newDrawingMode);
  };

  const handleMouseEnter = (row, col) => {
    if (!isDrawing || isRunning) return;
    const node = grid[row][col];
    if (node.isStart || node.isEnd) return;
    toggleWall(row, col, drawingMode);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const toggleWall = (row, col, mode) => {
    const newGrid = grid.map(gridRow =>
      gridRow.map(node =>
        node.row === row && node.col === col
          ? { ...node, isWall: mode === "wall" }
          : node
      )
    );
    setGrid(newGrid);
  };

  // Get neighbors
  const getNeighbors = (node, grid) => {
    const neighbors = [];
    const { row, col } = node;
    
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
    
    return neighbors.filter(neighbor => !neighbor.isWall);
  };

  // Dijkstra's Algorithm
  const dijkstra = async () => {
    setIsRunning(true);
    setAlgorithm("Dijkstra's Algorithm");
    setCancelRequested(false);
    clearPath();
    setNodesVisited(0);
    const startTime = Date.now();
    let visitedCount = 0;
    
    const newGrid = [...grid];
    const startNode = newGrid[START_ROW][START_COL];
    const endNode = newGrid[END_ROW][END_COL];
    
    startNode.distance = 0;
    const unvisitedNodes = [];
    
    for (const row of newGrid) {
      for (const node of row) {
        unvisitedNodes.push(node);
      }
    }
    
    while (unvisitedNodes.length && !cancelRequested) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift();
      
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) break;
      
      closestNode.isVisited = true;
      visitedCount++;
      setNodesVisited(visitedCount);
      setGrid([...newGrid]);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (closestNode === endNode) {
        // Reconstruct path
        let currentNode = endNode;
        while (currentNode !== null) {
          currentNode.isPath = true;
          currentNode = currentNode.previousNode;
        }
        setGrid([...newGrid]);
        break;
      }
      
      const neighbors = getNeighbors(closestNode, newGrid);
      for (const neighbor of neighbors) {
        const tentativeDistance = closestNode.distance + 1;
        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance;
          neighbor.previousNode = closestNode;
        }
      }
    }
    
    if (!cancelRequested) {
      await recordToBackend("Dijkstra's Algorithm", startTime, visitedCount, ROWS * COLS);
    }
    
    setIsRunning(false);
    setAlgorithm("");
    setCancelRequested(false);
  };



  return (
    <section id="pathfinding" className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🗺️ Pathfinding Algorithms</h2>
      
      {/* Algorithm Information */}
      <AlgorithmInfo type="pathfinding" algorithmName="Dijkstra's Algorithm" />
      
      {/* Performance Stats */}
      {(nodesVisited > 0 || executionTime > 0) && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Performance Metrics:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{nodesVisited}</div>
              <div>Nodes Visited</div>
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
          onClick={dijkstra}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Dijkstra's Algorithm
        </button>
        
        <button
          onClick={clearPath}
          disabled={isRunning}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Path
        </button>
        
        <button
          onClick={clearWalls}
          disabled={isRunning}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Walls
        </button>
        
        {isRunning && (
          <button
            onClick={cancelPathfinding}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel
          </button>
        )}
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Speed:</label>
          <input
            type="range"
            min="10"
            max="200"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isRunning}
            className="w-20"
          />
          <span className="text-sm">{speed}ms</span>
        </div>
      </div>

      {/* Current Algorithm Display */}
      {algorithm && (
        <div className="mb-4 p-3 bg-yellow-100 rounded-lg">
          <p className="text-center font-semibold">Currently running: {algorithm}</p>
        </div>
      )}

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Start</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>End</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-800 rounded"></div>
          <span>Wall</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300 rounded"></div>
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span>Path</span>
        </div>
        <span className="text-gray-600">Click and drag to draw walls</span>
      </div>

      {/* Grid Visualization */}
      <div className="flex justify-center">
        <div 
          className="grid gap-1 p-4 bg-gray-50 rounded-lg"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, rowIndex) =>
            row.map((node, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-6 h-6 border border-gray-300 cursor-pointer transition-colors duration-100 ${
                  node.isStart
                    ? 'bg-green-500'
                    : node.isEnd
                    ? 'bg-red-500'
                    : node.isWall
                    ? 'bg-gray-800'
                    : node.isPath
                    ? 'bg-yellow-400'
                    : node.isVisited
                    ? 'bg-blue-300'
                    : 'bg-white'
                }`}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
