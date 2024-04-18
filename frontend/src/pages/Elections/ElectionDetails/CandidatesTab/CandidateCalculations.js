// A function to calculate positions based on votes
export const calculateCandidatePosition = (candidates) => {
  // Sort candidates by votes in descending order
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  // Assign positions
  for (let i = 0; i < sortedCandidates.length; i++) {
    sortedCandidates[i].position = i + 1;
  }

  return sortedCandidates;
};

