import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserInput({ setUserSubmissions }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (inputValue) {
            const submissionResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${inputValue}`);
            setUserSubmissions(submissionResponse.data.result);
        } else {
            setUserSubmissions([]);
        }
    };

    return (
        <div className='userInput'>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    id='username'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default UserInput