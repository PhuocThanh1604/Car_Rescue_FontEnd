import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import as Router

import SignInSide from './features/auth/Singin';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router> 
        <Routes>
          <Route path="/" element={<Navigate to="/singin" />} />
          <Route path="/singin" element={<SignInSide />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
