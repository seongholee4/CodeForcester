import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserInput({ setUserSubmissions }) {
    const [username, setUsername] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
          const data = await response.json();
          if (data.status === 'OK') {
            setUserSubmissions(data.result);
            console.log("Passed");
          } else {
            console.error('Error fetching user submissions:', data.comment);
          }
        } catch (error) {
          console.error('Error fetching user submissions:', error);
        }
      };

    return (
        <div className='userInput'>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder="Enter your Codeforces handle (username)"
                    id='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default UserInput