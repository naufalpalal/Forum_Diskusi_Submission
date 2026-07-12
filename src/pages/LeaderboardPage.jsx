import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../store/leaderboardSlice';
import LoadingSpinner from '../components/LoadingSpinner';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <div className="page-container">
      <h1>🏆 Leaderboard</h1>
      {loading && <LoadingSpinner />}
      {error && <p className="error-msg">{error}</p>}
      <div className="leaderboard-list">
        {items.map((item, index) => (
          <div key={item.user.id} className="leaderboard-item">
            <span className={`rank rank-${index + 1}`}>{index + 1}</span>
            <img src={item.user.avatar} alt={item.user.name} className="avatar-sm" />
            <span className="leaderboard-name">{item.user.name}</span>
            <span className="leaderboard-score">
              {`⭐ ${item.score}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardPage;
