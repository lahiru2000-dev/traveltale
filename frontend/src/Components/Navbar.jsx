import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isAuth, setAuth] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000', { withCredentials: true })
      .then(res => {
        if (res.data.status === "success") {
          setAuth(true);
          setUsername(res.data.user?.name || 'User');
        } else {
          setAuth(false);
        }
      })
      .catch(() => setAuth(false));
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:8000/logout', { withCredentials: true })
      .then(() => {
        setAuth(false);
        navigate('/');
      })
      .catch(err => console.error('Logout error:', err));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">Travel Tales</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/new-post">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Blog</Link>
          </li>
        </ul>
        <div className="d-flex">
          {isAuth ? (
            <>
              <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/register" className="btn btn-outline-secondary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
