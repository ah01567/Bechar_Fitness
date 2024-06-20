import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Policy from './pages/Policy';
import Admin from './pages/Admin';
import History from './pages/History';


const App = () => {

  return (
    <Router>
      <div>
          <section>  
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history" element={<History />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </section>
      </div>
    </Router>
  );
};

export default App;
