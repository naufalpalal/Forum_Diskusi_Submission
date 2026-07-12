import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createThread } from '../store/threadsSlice';

function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setLoading(true);
    const result = await dispatch(createThread({ title, body, category }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Thread berhasil dibuat!');
      navigate('/');
    } else {
      toast.error(result.error.message);
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card" style={{ maxWidth: 700 }}>
        <h2>Buat Thread Baru</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="thread-title">Judul</label>
            <input
              id="thread-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="thread-category">Kategori (opsional)</label>
            <input
              id="thread-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Contoh: general, tech, ..."
            />
          </div>
          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="thread-body">Isi Thread</label>
            <textarea
              id="thread-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Membuat...' : 'Buat Thread'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewThreadPage;
