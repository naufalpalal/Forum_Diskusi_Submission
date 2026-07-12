function VoteButtons({
  upVotesBy, downVotesBy, userId, onVote,
}) {
  const isUpVoted = userId && upVotesBy.includes(userId);
  const isDownVoted = userId && downVotesBy.includes(userId);

  const handleUpVote = () => onVote(isUpVoted ? 'neutral' : 'up');
  const handleDownVote = () => onVote(isDownVoted ? 'neutral' : 'down');

  return (
    <div className="vote-buttons">
      <button
        type="button"
        className={`vote-btn ${isUpVoted ? 'active-up' : ''}`}
        onClick={handleUpVote}
        aria-label="upvote"
      >
        {'👍 '}
        {upVotesBy.length}
      </button>
      <button
        type="button"
        className={`vote-btn ${isDownVoted ? 'active-down' : ''}`}
        onClick={handleDownVote}
        aria-label="downvote"
      >
        {'👎 '}
        {downVotesBy.length}
      </button>
    </div>
  );
}

export default VoteButtons;
