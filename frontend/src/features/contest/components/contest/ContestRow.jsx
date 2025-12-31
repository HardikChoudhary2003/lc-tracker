import React from 'react';
import ContestTitleCell from './ContestTitleCell';
import ProblemCell from './ProblemCell';
import EmptyProblemCell from './EmptyProblemCell';

/**
 * Complete row for a contest with title and problems
 */
const ContestRow = ({ contest, userStatuses, highlightMatches = false }) => {
  const problems = contest.problems.slice(0, 4);

  return (
    <>
      {/* Contest Title Cell */}
      <ContestTitleCell 
        contest={contest} 
        highlightMatches={highlightMatches} 
      />

      {/* Problem Cells */}
      {problems.map((problem) => (
        <ProblemCell
          key={problem.titleSlug}
          problem={problem}
          isSolved={userStatuses[problem.titleSlug]}
          highlightMatches={highlightMatches}
        />
      ))}
      
      {/* Empty Cells */}
      {[...Array(4 - problems.length)].map((_, idx) => (
        <EmptyProblemCell key={`empty-${idx}`} />
      ))}
    </>
  );
};

export default ContestRow;
