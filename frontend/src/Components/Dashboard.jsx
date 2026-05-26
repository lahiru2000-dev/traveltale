import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import SearchBar from './Search';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editPost, setEditPost] = useState({ id: '', title: '', content: '', country_name: '', date_of_visit: '' });
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data
    axios.get('http://localhost:8000/dashboard', { withCredentials: true })
      .then(res => {
        if (res.data.status === 'success') {
          setCurrentUser(res.data.user.id);
        } else {
          console.error("Error fetching user data:", res.data.error);
        }
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
      });
      

      //fetch posts data
    axios.get('http://localhost:8000/get-posts', { withCredentials: true })
      .then(res => {
        if (res.data.status === 'success') {
          setPosts(res.data.posts);
          setFilteredPosts(res.data.posts);
        }
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
      });

       //fetch countries data
       axios.get("https://restcountries.com/v3.1/all?fields=name,capital,currencies,languages,flags")
       .then(res => setCountries(res.data))
       .catch(err => console.error("Error fetching countries:", err));

    
  }, []);

 
  

  const handleEditClick = (post) => {
    setEditPost({ id: post.id, title: post.title, content: post.content, country_name: post.country_name, date_of_visit: new Date(post.date_of_visit).toLocaleDateString()});
  };

  const handleChange = (e) => {
    setEditPost({ ...editPost, [e.target.name]: e.target.value });
  };

  //search post data
    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredPosts(posts);
            return;
          }
    const filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.country_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filteredPosts);
    };

  //edit post data
  const handleSaveChanges = () => {
    axios.put(`http://localhost:8000/update-post/${editPost.id}`, editPost, { withCredentials: true })
      .then(res => {
        if (res.data.status === 'success') {
          setPosts(posts.map(post => (post.id === editPost.id ? { ...post, ...editPost } : post)));
          setEditPost({ id: '', title: '', content: '', country_name: '', date_of_visit: '' });
          
          alert('Post updated successfully.');
          window.location.reload(); 
          
          const modal = document.getElementById('exampleModal');
          if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance?.hide();
          }
        } else {
          console.error("Error updating post:", res.data.error);
        }
      })
      .catch(err => {
        console.error("Error updating post:", err);
      });
  };

  //delete post data
  const handleDeleteClick = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios.delete(`http://localhost:8000/delete-post/${postId}`, { withCredentials: true })
        .then(res => {
          if (res.data.status === 'success') {
            setPosts(posts.filter(post => post.id !== postId));
            alert('Post deleted successfully.');
            window.location.reload(); 
          } else {
            console.error("Error deleting post:", res.data.error);
          }
        })
        .catch(err => {
          console.error("Error deleting post:", err);
        });
    }
  };

  //fetch countries data
  const getCountryInfo = (countryName) => {
    return countries.find(country => 
      country.name.common.toLowerCase() === countryName.toLowerCase() ||
      country.name.official.toLowerCase() === countryName.toLowerCase()
    );
  };

  return (
    <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>Welcome to the blog</h1>
            <SearchBar onSearch={handleSearch} />
        </div>
      
     
    <div className="row">
      {filteredPosts.map((post) => {
        const countryInfo = getCountryInfo(post.country_name);
        return (
          <div className="col-md-6 col-lg-4 mb-4" key={post.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text flex-grow-1">{post.content}</p>
                
                {/* Country Information Section */}
                <div className="mt-auto">
                  <p><strong>Country:</strong> {post.country_name}</p>
                  {countryInfo && (
                    <div className="country-info mb-3">
                      <img 
                        src={countryInfo.flags.png} 
                        alt={`${post.country_name} Flag`} 
                        className="img-thumbnail mb-2"
                        style={{ width: '80px' }}
                      />
                      <p className="mb-1">
                        <strong>Capital:</strong> {countryInfo.capital?.[0] || 'N/A'}
                      </p>
                      <p className="mb-1">
                        <strong>Currency:</strong> 
                        {countryInfo.currencies ? 
                          Object.values(countryInfo.currencies)
                            .map(c => `${c.name} (${c.symbol})`)
                            .join(', ') : 'N/A'}
                      </p>
                    </div>
                  )}
                  <p><strong>Date of Visit:</strong> {new Date(post.date_of_visit).toLocaleDateString()}</p>
                </div>

                {/* Action Buttons Section */}
                <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                  <button 
                    className="btn btn-link text-decoration-none"
                    onClick={() => navigate(`/posts/${post.id}`)}
                  >
                    Read More →
                  </button>
                  
                  {currentUser === post.user_id && (
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        data-bs-toggle="modal" 
                        data-bs-target="#exampleModal" 
                        onClick={() => handleEditClick(post)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDeleteClick(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
      {/* Modal for Edit Post */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Post</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" value={editPost.title} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea className="form-control" rows="4" name="content" value={editPost.content} onChange={handleChange}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Country</label>
                <input type="text" className="form-control" name="country_name" value={editPost.country_name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Date of visit</label>
                <input type="date" className="form-control" rows="4" name="date_of_visit" value={editPost.date_of_visit} onChange={handleChange}></input>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary"  onClick={handleSaveChanges} data-bs-dismiss="modal">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
      <nav>
        <ul className="pagination justify-content-center">
          <li className="page-item disabled"><span className="page-link">Previous</span></li>
          <li className="page-item active"><span className="page-link">1</span></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">Next</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
