import React, { useState, useEffect } from 'react';
import ContestRowWithData from './ContestRowWithData';

function ContestList({ userSubmissions }) {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      const response = await fetch('../contests.json');
      const data = await response.json();
      console.log('Fetched contests data:', data); //  Add this line to debug

      setContests(data.contests);
    };

    fetchContests();
  }, []);

  return (
    <div className='contestList'>
      <h1>Contest List</h1>
      <table>
        <thead>
          <tr>
            <th>Contest Name</th>
            <th>Problems</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest) => (
            <ContestRowWithData
              key={contest.contestId}
              contest={contest}
              userSubmissions={userSubmissions}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContestList;
