import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TicketAssistant } from './pages/TicketAssistant';
import { HealthCheck } from './pages/HealthCheck';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ticket" element={<TicketAssistant />} />
          <Route path="/health" element={<HealthCheck />} />
          <Route path="/search" element={<KnowledgeBase />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
