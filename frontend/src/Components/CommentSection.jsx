import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  
  useEffect(() => {
    axios.get(`http://localhost:8000/get-comments/${postId}`, { withCredentials: true })
        .then(res => {
            if (res.data.status === 'success') {
                setComments(res.data.comments);
            }
        })
      .catch(err => console.error('Error fetching comments:', err));
  }, [postId]);

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    axios.post(`http://localhost:8000/add-comment/${postId}`, 
      { content: newComment }, 
      { withCredentials: true }
    )
    .then(res => {
      if (res.data.status === 'success') {
        setComments(prev => [...prev, res.data.comment]);
        setNewComment('');
      } else {
        console.error('Error posting comment:', res.data.error);
      }
    })
    .catch(err => console.error('Error posting comment:', err));
  };



  

  return (
    <div className="comment-section mt-3">
      <div className="mb-3 d-flex">
        <textarea
          className="form-control me-2"
          rows="2"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handlePostComment}>Post</button>
      </div>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="mb-2 p-2 border rounded">
            <div className="d-flex justify-content-between">
              <strong>{comment.user_name || 'User'}</strong>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
            </div>
            <p className="mb-1">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
