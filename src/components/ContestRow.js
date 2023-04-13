import React from 'react';

function ContestRow({ contest, problems, userSubmissions }) {

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
        <ul>
          {problems.map((problem) => (
            <li
              key={problem.index}
              style={{
                backgroundcolor: getProblemStatus(userSubmissions, problem) === 'solved' ? 'green' : 'black'
              }}
            >
              {problem.index} {problem.name} {problem.solvedCount}
            </li>
          ))}
        </ul>
      </td>
    </tr>
  );
}

export default ContestRow;