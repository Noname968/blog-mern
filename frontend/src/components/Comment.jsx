import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Comment.css'

const Comment = ({ comment, isEditing, onEdit, onDelete, onStartEditing, onCancelEditing }) => {
    const [editedContent, setEditedContent] = useState(comment.content);
    const { currentUser } = useAuth(); // Assuming you have a currentUser object from your AuthContext

    const handleEdit = () => {
        onEdit(editedContent);
    };

    const handleDelete = () => {
        onDelete();
    };

    function formatDate(isoDate) {
        const updatedDate = new Date(isoDate);
        const currentDate = new Date();
      
        const timeDifference = currentDate - updatedDate;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days/30);
      
         if (months > 0) {
            return ` ${months} months ago`;
          }
        else if (days > 0) {
          return ` ${days} days ago`;
        } else if (hours > 0) {
          return ` ${hours} hours ago`;
        } else if (minutes > 0) {
          return ` ${minutes}min ago`;
        } else {
          return ` Just now`;
        }
      }

    return (
        <div className="comment">
            <div className="comment-header">
                <img
                    className="authorimg commentimg"
                    src="https://miro.medium.com/v2/resize:fill:40:40/0*RPyfprrNVUR8PSyB"
                    width="32"
                    height="32"
                    loading="lazy"
                />
                <span className="comment-username">{comment.username}</span>
                <span className='dot'>.</span>
                <span className="comment-date">{formatDate(comment.updatedAt)}</span>
            </div>
            {isEditing ? (
                <div className="comment-edit">
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className='commentedit'
                    />
                    <span onClick={onCancelEditing}>Cancel</span>
                    <span onClick={handleEdit}>Save</span>
                </div>
            ) : (
                <div className="comment-content">
                    <p className='commentcontent'>{comment.content}</p>
                    {currentUser && currentUser.name === comment.username && (
                        <div className="comment-actions">
                            <span onClick={onStartEditing}>
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>                            </span>
                            <span onClick={handleDelete}>
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Comment;
