import axios from "axios";

// const baseURL = "http://localhost:5000";
// const baseURL = "https://blog-mernbackend.vercel.app";
const baseURL = "https://blog-mern-backend.cyclic.cloud"

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const checkUsernameAvailability = async (username) => {
  try {
    const response = await api.get(`/api/auth/check-username/${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkEmailAvailability = async (email) => {
  try {
    const response = await api.get(`/api/auth/check-email/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchPosts = async (searchTerm) => {
  try {
    const response = await api.get(`/api/post/searchpost/${searchTerm}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/api/auth/", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.get('api/auth/logout');
    console.log(response)
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

export const checkLoggedIn = async () => {
  try {
    const response = await api.get("/api/auth/loggedIn");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/api/auth/user");
    return response;
  } catch (error) {
    throw error;
  }
};

// post user
export async function fetchUserDetails(userId) {
  try {
    const response = await api.get(`api/auth/postuser/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Update user details
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/auth/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/api/auth/forgot/password", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, userId, newPassword) => {
  try {
    const response = await api.put(
      `/api/auth/reset/password/${token}/${userId}`,
      {
        password: newPassword,
        passwordverify: newPassword,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// fetch all latest posts
export const fetchLatestPosts = async () => {
  try {
    const response = await api.get("api/post/latestposts");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching latest posts");
  }
};

// fetch current user posts
export const fetchmyPosts = async () => {
  try {
    const response = await api.get("/api/post/myposts");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// fetch user posts by userId
export const fetchuserpostsbyId = async (userId) => {
  try {
    const response = await api.get(`/api/post/userposts/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// create a new post
export const createPost = async (postData) => {
  try {
    const response = await api.post("/api/post/create", postData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// fetch the single post data
export const fetchSinglePost = async (postId) => {
  try {
    const response = await api.get(`/api/post/${postId}`);
    if (!response) {
      throw new Error("Failed to fetch post");
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Edit a post by ID
export const editPost = async (postId, updatedData) => {
  try {
    const response = await api.put(`/api/post/${postId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a post by ID
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/post/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get all favorite posts of a user
export const fetchFavoritePosts = async () => {
  try {
    const response = await api.get("/api/favorite/allfavs");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add posts to favorites
export const addToFavorites = async (postId) => {
  try {
    const response = await api.post(`/api/favorite/add/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove posts from favorites
export const removeFromFavorites = async (postId) => {
  try {
    const response = await api.post(`/api/favorite/remove/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// check favorite post or not
export const checkIfPostIsFavorited = async (postId) => {
  try {
    const response = await api.get(`/api/favorite/check/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// follow a user
export const followUser = async (userId) => {
  try {
    const response = await api.post(`api/auth/follow/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// unfollow a user
export const unfollowUser = async (userId) => {
  try {
    const response = await api.post(`api/auth/unfollow/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// like a user
export const Likeforpost = async (postId) => {
  try {
    const response = await api.post(`api/post/like/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new comment
export const createComment = async (postId, content) => {
  try {
    const response = await api.post(`api/comment/create`, { postId, content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch comments for a specific post
export const fetchComments = async (postId) => {
  try {
    const response = await api.get(`api/comment/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a comment
export const updateComment = async (commentId, content) => {
  try {
    const response = await api.put(`api/comment/update/${commentId}`, { content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`api/comment/delete/${commentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
