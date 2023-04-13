import React, { useState, useEffect } from 'react';
import UserInput from './UserInput';

function Header({ setUserSubmissions }) {
  
  return (
    <div className='header'>
      <h1>Codeforces Tracker</h1>
      <UserInput setUserSubmissions={setUserSubmissions} />

    </div>
  )
}

export default Header