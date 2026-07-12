import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">💬 Forum Diskusi</Link>
      <div className="navbar-links">
        <Link to="/">Threads</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        {user ? (
          <>
            <span className="navbar-user">
              <img src={user.avatar} alt={user.name} className="avatar-sm" />
              {user.name}
            </span>
            <button type="button" onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
