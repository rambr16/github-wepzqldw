import React from 'react';
import { LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  const { logout } = useAuth();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">CSV Email Processor</h1>
      <div className="flex gap-2">
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </button>
        <button
          onClick={logout}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};