import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import './Postcard.css'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function PostCard({ post}) {
  const { currentUser, checkIfPostIsFavorited, addToFavorites, removeFromFavorites, fetchfavoriteposts, isLoggedIn } = useAuth();
  const [isInFavorites, setIsInFavorites] = useState(false);

  useEffect(() => {
    const fetchPostIsFavorited = async () => {
      if (currentUser) {
        const favorited = await checkIfPostIsFavorited(post._id);
        setIsInFavorites(favorited);
      }
    };
    fetchPostIsFavorited();
  }, [currentUser, post._id, checkIfPostIsFavorited]);

  const handleFavorite = async () => {
    try {
      if (isInFavorites) {
        await removeFromFavorites(post._id);
        setIsInFavorites(false);
        toast.success("Removed From Library")
      } else {
        await addToFavorites(post._id);
        setIsInFavorites(true);
        toast.success("Added to Library")
      }
      await fetchfavoriteposts();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("An Error Occured")
    }
  };

  function formatDate(isoDate) {
    const updatedDate = new Date(isoDate);
    const currentDate = new Date();
    const timeDifference = currentDate - updatedDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (months > 0) {
      return ` ${months} months ago`;
    }
    else if (days > 0) {
      if (days === 1) {
        return ` ${days} day ago`
      }
      return ` ${days} days ago`;
    } else if (hours > 0) {
      if(hours==1){
        return ` ${hours} hour ago`; 
      }
      return ` ${hours} hours ago`;
    } else if (minutes > 0) {
      return ` ${minutes}min ago`;
    } else {
      return ` Just now`;
    }
  }

  return (
    <div className="postcard-container">
      <div className="postcard-single">
        <div className="postcardimg">
          <img src={post.imageUrl} alt={post.title} className="singlepimg" />
          <div className="addtofav">
            <div className={`bookmark ${isInFavorites ? "saved" : ""}`} onClick={currentUser && handleFavorite}>
              <span className="bookmark-text">{isInFavorites ? "Saved" : "Save"}</span>
              {!isInFavorites ? (
                <svg className="line" width={"16"} height={"16"} viewBox="0 0 24 24">
                  <path d="M14.5 10.6499H9.5" strokeMiterlimit="10"></path>
                  <path d="M12 8.20996V13.21" strokeMiterlimit="10"></path>
                  <path d="M16.8199 2H7.17995C5.04995 2 3.31995 3.74 3.31995 5.86V19.95C3.31995 21.75 4.60995 22.51 6.18995 21.64L11.0699 18.93C11.5899 18.64 12.4299 18.64 12.9399 18.93L17.8199 21.64C19.3999 22.52 20.6899 21.76 20.6899 19.95V5.86C20.6799 3.74 18.9499 2 16.8199 2Z"></path>
                </svg>
              ) : (
                <svg className="saved" width={"18"} height={"18"} viewBox="0 0 24 24">
                  <path d="M16.8203 1.91016H7.18031C5.06031 1.91016 3.32031 3.65016 3.32031 5.77016V19.8602C3.32031 21.6602 4.61031 22.4202 6.19031 21.5502L11.0703 18.8402C11.5903 18.5502 12.4303 18.5502 12.9403 18.8402L17.8203 21.5502C19.4003 22.4302 20.6903 21.6702 20.6903 19.8602V5.77016C20.6803 3.65016 18.9503 1.91016 16.8203 1.91016ZM15.6203 9.03016L11.6203 13.0302C11.4703 13.1802 11.2803 13.2502 11.0903 13.2502C10.9003 13.2502 10.7103 13.1802 10.5603 13.0302L9.06031 11.5302C8.77031 11.2402 8.77031 10.7602 9.06031 10.4702C9.35031 10.1802 9.83031 10.1802 10.1203 10.4702L11.0903 11.4402L14.5603 7.97016C14.8503 7.68016 15.3303 7.68016 15.6203 7.97016C15.9103 8.26016 15.9103 8.74016 15.6203 9.03016Z"></path>
                </svg>
              )}
            </div>
          </div>
        </div>
        <div className="postcardcont">
          <div className="postcardtags">
            <span style={{ opacity: "0.8" }}>in</span>{" "}
            {post.tags.map((tag, index) => (
              <span key={tag} className="postcardtag">
                {index > 0 && ", "}{tag}
              </span>
            ))}
          </div>
          <Link to={`/post/${post._id}`} className="post-title-link">
            <div className="postcardtitle">
              {post.title}
            </div>
          </Link>
          <div className="postcardcontent" dangerouslySetInnerHTML={{ __html: post.content }}>
          </div>
        </div>
        <div className="postcarddate">{formatDate(post.createdAt)}</div>
      </div>
    </div>
  );
}

export default PostCard;
