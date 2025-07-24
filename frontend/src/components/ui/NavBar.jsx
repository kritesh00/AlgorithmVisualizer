import React from "react";

export default function NavBar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold tracking-wide">⚙️ Algorithm Visualizer</h1>
      <div className="flex items-center space-x-6">
        <div className="space-x-6 text-sm md:text-base">
          <a href="#sorting" className="hover:text-blue-400 transition">Sorting</a>
          <a href="#searching" className="hover:text-blue-400 transition">Searching</a>
          <a href="#pathfinding" className="hover:text-blue-400 transition">Pathfinding</a>
        </div>
      </div>
    </nav>
  );
}
