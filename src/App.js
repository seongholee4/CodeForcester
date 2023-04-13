import './App.css';
import React, { useState, useEffect } from 'react';
import UserInput from './components/UserInput';
import ContestList from './components/ContestList';
import Header from './components/Header'

function App() {
  const [userSubmissions, setUserSubmissions] = useState([]);

  return (
    <div className="app">
      <div className="app__body">
        <Header setUserSubmissions={setUserSubmissions}/>
        <div className="app__bodyLeft">
          <h2>Left</h2>
        </div>
        <div className="app__bodyRight">
          <h2>Right</h2>
          <div>
            <ContestList userSubmissions={userSubmissions} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
