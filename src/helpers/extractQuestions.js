/**
 * extractQuestions
 * @param { array } results
 * @returns { array } formated questions
 */
export default (results) => results.map((question) => {
  const {
    id, owner, title, body, tags, answers, votes, createdAt, updatedAt
  } = question;
  return {
    id,
    owner: owner.displayName,
    title,
    body,
    tags,
    answers: answers.map((answer) => ({
      owner: answer.owner.displayName,
      body: answer.body,
      createdAt: answer.createdAt
    })),
    upvotes: votes.filter((vote) => String(vote.voteType) === 'up').length,
    downvotes: votes.filter((vote) => String(vote.voteType) === 'down').length,
    createdAt,
    updatedAt
  };
});
