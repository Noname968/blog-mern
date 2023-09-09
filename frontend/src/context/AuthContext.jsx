import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const popularTags = [
    "Technology",
    "Sports",
    "Music",
    "Film",
    "Books",
    "Fashion",
    "Photography",
    "Gaming",
    "Programming",
    "Fitness",
    "Cooking",
    "Adventure",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Economics",
    "Social Media",
    "Climate Change",
    "Science Fiction",
    "Nature",
    "Animals",
    "Science",
    "Health",
    "Productivity",
    "Design",
    "Travel",
    "Food",
    "Startup",
    "Marketing",
    "Education",
    "Politics",
    "Environment","Psychology","Business","Others",
  ];
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [latestPosts, setLatestPosts] = useState([]);
  const [favposts, setfavposts] = useState([]);

  // Edit a post
  const editPost = async (postId, updatedData) => {
    try {
      const response = await api.editPost(postId, updatedData);
      // console.log(response)
      return response
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  // Function to delete a post
  const deletePost = async (postId) => {
    try {
      await api.deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

    // Fetch and set user details based on the userId
    const fetchAndSetUserDetails = async (userId) => {
      try {
        const response = await api.fetchUserDetails(userId);
        return response
      } catch (error) {
        console.error(error.message);
      }
    };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.fetchLatestPosts();
        setLatestPosts(response);
      } catch (error) {
        console.log("Error fetching latest posts");
      }
    };
    fetchPosts();
  }, []);

  const registerUser = async (userData) => {
    try {
      const response = await api.registerUser(userData);
      if(response){
        const userdata = await api.fetchCurrentUser();
        setCurrentUser(userdata.data.user);
        setIsLoggedIn(true)
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await api.loginUser(credentials);
      if(response){
        const userdata = await api.fetchCurrentUser();
        setCurrentUser(userdata.data.user);
        setIsLoggedIn(true)
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  
  useEffect(() => {
    // Fetch current user's information here
    const fetchCurrentUser = async () => {
      try {
        const loginstatus = await api.checkLoggedIn();
        setIsLoggedIn(loginstatus)
        if (loginstatus) {
          const response = await api.fetchCurrentUser();
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, [isLoggedIn]);

// Function to log the user out
const handleLogout = async () => {
  const success = await api.logoutUser();
  if (success) {
    setIsLoggedIn(undefined);
    setCurrentUser(undefined);
  } else {
    throw error;
  }
};

  const updateUser = async (userId, userData) => {
    try {
      const response = await api.updateUser(userId, userData);
      if (response) {
        const updatedUserDataResponse = await api.fetchCurrentUser();
        setCurrentUser(updatedUserDataResponse.data.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token, userId, newPassword) => {
    try {
      const response = await api.resetPassword(token, userId, newPassword);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const followUser = async (userId) => {
    try {
      await api.followUser(userId);
      // Optionally, you can update the current user's following list here
      setCurrentUser(prevUser => ({
        ...prevUser,
        following: [...prevUser.following, userId]
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      await api.unfollowUser(userId);
      setCurrentUser(prevUser => ({
        ...prevUser,
        following: prevUser.following.filter(id => id !== userId)
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const Likepost = async (postId) => {
    try {
      await api.Likeforpost(postId);
    } catch (error) {
      console.error('Error liking for post:', error);
    }
  };

  
  const addToFavorites = async (postId) => {
    try {
      await api.addToFavorites(postId); 
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (postId) => {
    try {
      await api.removeFromFavorites(postId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const checkIfPostIsFavorited = async (postId) => {
    try {
      const response = await api.checkIfPostIsFavorited(postId);
      return response;
    } catch (error) {
      console.error('Error checking if post is favorited:', error);
    }
  };

    const fetchfavoriteposts = async () => {
      try {
          const response = await api.fetchFavoritePosts();
          setfavposts(response)
        } catch (error) {
          console.error('Error fetching posts:', error);
      }
  };
  
  const authContextValues = {
    registerUser,
    loginUser,
    updateUser,
    forgotPassword,
    resetPassword,
    isLoggedIn,
    popularTags,
    currentUser,
    fetchAndSetUserDetails,
    followUser,
    unfollowUser,
    Likepost,
    addToFavorites,
    removeFromFavorites,
    checkIfPostIsFavorited,
    latestPosts,
    setLatestPosts,
    editPost,
    deletePost,
    favposts,
    fetchfavoriteposts,
    setfavposts,
    logoutUser:handleLogout
  };

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
};
