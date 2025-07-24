import React from "react";
import { DashboardProvider } from "./contexts/DashboardContext";
import NavBar from "./components/ui/NavBar";
import Dashboard from "./components/Dashboard";
import SortingVisualizer from "./components/SortingVisualizer";
import SearchingVisualizer from "./components/SearchingVisualizer";
import PathfindingVisualizer from "./components/PathfindingVisualizer";

export default function App() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <NavBar />
        <main className="max-w-7xl mx-auto p-4 space-y-8">
          <Dashboard />
          <SortingVisualizer />
          <SearchingVisualizer />
          <PathfindingVisualizer />
        </main>
      </div>
    </DashboardProvider>
  );
}
