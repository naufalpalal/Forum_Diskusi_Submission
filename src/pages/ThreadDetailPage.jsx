import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  fetchThreadDetail, createComment, optimisticVoteDetail,
} from '../store/threadDetailSlice';
import { voteThread } from '../store/threadsSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import VoteButtons from '../components/VoteButtons';
import CommentItem from '../components/CommentItem';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { thread, loading, error } = useSelector((state) => state.threadDetail);
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId));
  }, [dispatch, threadId]);

  const handleVote = (voteType) => {
    if (!user) { navigate('/login'); return; }
    dispatch(optimisticVoteDetail({ threadId, voteType, userId: user.id }));
    dispatch(voteThread({ threadId, voteType, userId: user.id }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!comment.trim()) return;
    setSubmitting(true);
    await dispatch(createComment({ threadId, content: comment }));
    setComment('');
    setSubmitting(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-msg">{error}</p>;
  if (!thread) return null;

  const timeAgo = formatDistanceToNow(
    new Date(thread.createdAt),
    { addSuffix: true, locale: id },
  );

  return (
    <div className="page-container">
      <button type="button" className="btn btn-outline back-btn" onClick={() => navigate('/')}>
        ← Kembali
      </button>

      <div className="thread-detail">
        {thread.category && (
          <span className="category-badge">
            {`#${thread.category}`}
          </span>
        )}
        <h1>{thread.title}</h1>
        <div className="thread-meta">
          <div className="thread-owner">
            <img src={thread.owner.avatar} alt={thread.owner.name} className="avatar-sm" />
            <strong>{thread.owner.name}</strong>
          </div>
          <span className="meta-item">
            {`🕐 ${timeAgo}`}
          </span>
        </div>
        {/* eslint-disable-next-line react/no-danger */}
        <div className="thread-body" dangerouslySetInnerHTML={{ __html: thread.body }} />
        <VoteButtons
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          userId={user?.id}
          onVote={handleVote}
        />
      </div>

      <div className="comments-section">
        <h3>
          {`Komentar (${thread.comments.length})`}
        </h3>

        <form onSubmit={handleComment} className="comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={user ? 'Tulis komentar...' : 'Login untuk berkomentar'}
            disabled={!user || submitting}
            rows={3}
          />
          {user && (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !comment.trim()}
            >
              {submitting ? 'Mengirim...' : 'Kirim Komentar'}
            </button>
          )}
        </form>

        {thread.comments.map((c) => (
          <CommentItem key={c.id} comment={c} threadId={threadId} />
        ))}
      </div>
    </div>
  );
}

export default ThreadDetailPage;
