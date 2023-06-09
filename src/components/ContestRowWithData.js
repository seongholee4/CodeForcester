import React from 'react';
import ContestRow from './ContestRow';

function ContestRowWithData({ contest, userSubmissions }) {

  return (
    <ContestRow
      contest={contest}
      problems={contest.problems || []}
      userSubmissions={userSubmissions}
    />
  );
}

export default ContestRowWithData;
