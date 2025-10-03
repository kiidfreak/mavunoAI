import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'
import CarbonDashboard from './pages/CarbonDashboard'
import Weather from './pages/Weather'
import Advisory from './pages/Advisory'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/carbon" element={<CarbonDashboard />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/advisory" element={<Advisory />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
