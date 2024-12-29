import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CSVProcessor } from './components/CSVProcessor';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <CSVProcessor />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;