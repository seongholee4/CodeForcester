import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContestRow from './ContestRow';

function ContestRowWithData({ contest, userSubmissions }) {
  const [problems, setProblems] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      const fetchData = async (url, retryAttempts = 3) => {
        try {
          const response = await axios.get(url);
          return response;
        } catch (error) {
          if (retryAttempts > 0) {
            return await fetchData(url, retryAttempts - 1);
          } else {
            throw error;
          }
        }
      };

      try {
        if (contest.phase !== 'BEFORE' && contest.phase !== 'FAILED') {
          const response = await fetchData(`https://codeforces.com/api/contest.standings?contestId=${contest.id}&from=1&count=1`);
          setProblems(response.data.result.problems);
        }
      } catch (error) {
        console.error('Error fetching problems for contest', contest.id, error);
      }
    };

    fetchProblems();
  }, [contest]);

  return (
    <ContestRow
      contest={contest}
      problems={problems || []}
      userSubmissions={userSubmissions}
      isLoading={!problems}
    />
  );
}

export default ContestRowWithData;
