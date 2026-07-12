import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import VoteButtons from './VoteButtons';
import { optimisticVoteComment, voteComment } from '../store/threadDetailSlice';

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleVote = (voteType) => {
    if (!user) return;
    dispatch(optimisticVoteComment({ commentId: comment.id, voteType, userId: user.id }));
    dispatch(voteComment({
      threadId, commentId: comment.id, voteType, userId: user.id,
    }));
  };

  const timeAgo = formatDistanceToNow(
    new Date(comment.createdAt),
    { addSuffix: true, locale: id },
  );

  return (
    <div className="comment-item">
      <div className="comment-owner">
        <img src={comment.owner.avatar} alt={comment.owner.name} className="avatar-sm" />
        <strong>{comment.owner.name}</strong>
        <span className="meta-item">{timeAgo}</span>
      </div>
      {/* eslint-disable-next-line react/no-danger */}
      <div className="comment-content" dangerouslySetInnerHTML={{ __html: comment.content }} />
      <VoteButtons
        upVotesBy={comment.upVotesBy}
        downVotesBy={comment.downVotesBy}
        userId={user?.id}
        onVote={handleVote}
      />
    </div>
  );
}

export default CommentItem;
