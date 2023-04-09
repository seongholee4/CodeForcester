import React from 'react';

function ContestRow({ contest, problems, userSubmissions, isLoading }) {

  const getProblemStatus = (userSubmissions, problem) => {
    const submission = userSubmissions.find(
      (s) => s.problem.contestId === problem.contestId && s.problem.index === problem.index
    );

    if (!submission) {
      return 'unsolved';
    }

    if (submission.verdict === 'OK') {
      return 'solved';
    }

    return 'wrong';
  };

  return (
    <tr>
      <td>{contest.name}</td>
      <td>
        {isLoading ? (
          <span>Loading problems...</span>
        ) : (
          <ul>
            {problems.map((problem) => (
              <li key={problem.index}>
                {problem.index}
              </li>
            ))}
          </ul>
        )}
      </td>
    </tr>
  );
}

export default ContestRow;