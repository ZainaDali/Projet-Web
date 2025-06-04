// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen fixed top-0 left-0 bg-gray-800 text-white p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-10">MonApp</h2>
      <ul className="space-y-6">
        <li>
          <Link
            to="/profile"
            className={`block p-2 rounded-lg transition duration-300 ${
              isActive('/profile') ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            🧑 Profil
          </Link>
        </li>
        <li>
          <Link
            to="/conversations"
            className={`block p-2 rounded-lg transition duration-300 ${
              isActive('/conversations') ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            💬 Conversations
          </Link>
        </li>
      </ul>
    </div>
  );
}
