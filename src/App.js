import './App.css';
import React, { useState, useEffect } from 'react';
import UserInput from './components/UserInput';
import ContestList from './components/ContestList';


function App() {
  const [userSubmissions, setUserSubmissions] = useState([]);


  return (
    <div className="app">
      <h1>Codeforces Tracker</h1>
      <div className="app__body">
        <UserInput setUserSubmissions={setUserSubmissions} />
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
