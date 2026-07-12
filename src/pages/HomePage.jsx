import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreads, setCategoryFilter } from '../store/threadsSlice';
import ThreadCard from '../components/ThreadCard';
import LoadingSpinner from '../components/LoadingSpinner';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items, users, loading, error, categoryFilter,
  } = useSelector((state) => state.threads);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  const categories = useMemo(() => {
    const cats = [...new Set(items.map((t) => t.category).filter(Boolean))];
    return cats;
  }, [items]);

  const filteredThreads = useMemo(() => {
    if (!categoryFilter) return items;
    return items.filter((t) => t.category === categoryFilter);
  }, [items, categoryFilter]);

  const getOwner = (ownerId) => users.find((u) => u.id === ownerId);

  const handleNewThread = () => {
    if (!user) { navigate('/login'); return; }
    navigate('/threads/new');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Forum Diskusi</h1>
        <button type="button" className="btn btn-primary" onClick={handleNewThread}>
          + Buat Thread
        </button>
      </div>

      {categories.length > 0 && (
        <div className="category-filter">
          <button
            type="button"
            className={`category-chip ${!categoryFilter ? 'active' : ''}`}
            onClick={() => dispatch(setCategoryFilter(''))}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              className={`category-chip ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => dispatch(setCategoryFilter(cat))}
            >
              {`#${cat}`}
            </button>
          ))}
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error && <p className="error-msg">{error}</p>}

      <div className="thread-list">
        {filteredThreads.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} owner={getOwner(thread.ownerId)} />
        ))}
        {!loading && filteredThreads.length === 0 && (
          <p className="empty-msg">Tidak ada thread ditemukan.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
