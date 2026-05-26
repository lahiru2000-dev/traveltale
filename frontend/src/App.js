import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import NewPost from './Components/New-post';
import OnePostPage from './Components/onePostPage';
import CommentSection from './Components/CommentSection';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/posts/:id" element={<OnePostPage />} />
          <Route path="/posts/:id/comments" element={<CommentSection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
