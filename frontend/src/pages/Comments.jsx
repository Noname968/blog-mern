import React, { useState } from 'react';
import Comment from '../components/Comment';
import * as api from '../api'; 
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext';

const Comments = ({ postId,comments,setComments }) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const {currentUser} = useAuth();

  const handleAddComment = async () => {
    if(!currentUser){
      return toast.error("Login to Comment")
    }
    if (newComment.trim() === '') {
      return toast.error("Write a comment");
    }
    try {
      const addedComment = await api.createComment(postId,newComment);
      setComments([ addedComment.comment,...comments]);
      setNewComment('');
      toast.success("Comment posted Successful")
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Error adding comment")
    }
  };

  const handleEditComment = async (commentId, updatedContent) => {
    try {
      const updatedComment = await api.updateComment(commentId, updatedContent);
      const updatedComments = comments.map((comment) =>
        comment._id === commentId ? updatedComment.comment : comment
      );
      setComments(updatedComments);
      toast.success("Comment Updated Successfully")
      setEditingCommentId(null);
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error("Error updating comment")
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.deleteComment(commentId);
      const updatedComments = comments.filter((comment) => comment._id !== commentId);
      setComments(updatedComments);
      toast.success("Comment Deleted Successfully")
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error("Error deleting comment")
    }
  };

  
  return (
    <div className="comments-container" style={{marginBottom:"2rem"}}>
      <h3>Comments</h3>
      <div className="add-comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a new comment..."
          className='commentadd'
        />
        <button onClick={handleAddComment}>Post</button>
      </div>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          isEditing={editingCommentId === comment._id}
          onEdit={(updatedContent) => handleEditComment(comment._id, updatedContent)}
          onDelete={() => handleDeleteComment(comment._id)}
          onStartEditing={() => setEditingCommentId(comment._id)}
          onCancelEditing={() => setEditingCommentId(null)}
        />
      ))}
    </div>
  );
};

export default Comments;
