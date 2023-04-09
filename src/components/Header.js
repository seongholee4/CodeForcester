import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContestList from './ContestList';
import UserInput from './UserInput';

function Header() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchSubmissions() {
      if (username) {
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);
        setUserSubmissions(response.data.result);
      }
    }
    fetchSubmissions();
  }, [username]);

  return (
    <div className='header'>
      <h1>Codeforces Tracker</h1>
      <UserInput setUsername={setUsername} />
      <ContestList contests={contests} userSubmissions={userSubmissions} />
    </div>
  )
}

export default Header