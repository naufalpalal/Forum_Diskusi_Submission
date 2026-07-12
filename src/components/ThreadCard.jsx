import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import VoteButtons from './VoteButtons';
import { optimisticVoteThread, voteThread } from '../store/threadsSlice';

function ThreadCard({ thread, owner }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleVote = (voteType) => {
    if (!user) return;
    dispatch(optimisticVoteThread({ threadId: thread.id, voteType, userId: user.id }));
    dispatch(voteThread({ threadId: thread.id, voteType, userId: user.id }));
  };

  const bodyPreview = thread.body.replace(/<[^>]+>/g, '').slice(0, 150);
  const timeAgo = formatDistanceToNow(
    new Date(thread.createdAt),
    { addSuffix: true, locale: id },
  );

  return (
    <div className="thread-card">
      <div className="thread-card-header">
        {thread.category && (
          <span className="category-badge">
            {`#${thread.category}`}
          </span>
        )}
      </div>
      <Link to={`/threads/${thread.id}`} className="thread-title">{thread.title}</Link>
      <p className="thread-body-preview">
        {bodyPreview}
        {thread.body.length > 150 ? '...' : ''}
      </p>
      <div className="thread-meta">
        <div className="thread-owner">
          {owner && <img src={owner.avatar} alt={owner.name} className="avatar-sm" />}
          <span>{owner ? owner.name : 'Unknown'}</span>
        </div>
        <span className="meta-item">
          {`🕐 ${timeAgo}`}
        </span>
        <span className="meta-item">
          {`💬 ${thread.totalComments} komentar`}
        </span>
        <VoteButtons
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          userId={user?.id}
          onVote={handleVote}
        />
      </div>
    </div>
  );
}

export default ThreadCard;
