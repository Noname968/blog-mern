const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const userauth = require("../middleware/userauth");
const upload = require("../middleware/upload");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../services/cloudinary");

//Upload Image to Cloudinary
// Create a new post
router.post(
  "/create",
  userauth,
  upload.single("userImage"),
  async (req, res) => {
    try {
      const { title, content, tags } = req.body;
      const userid = req.user.id;
      const author = req.user.username;

      if (!title || !content || !tags) {
        return res.status(400).json({ error: "All fields are required" });
      }

     let imageUrl = ''; // Default image URL
     let publicId = '';

      // If an image was uploaded, process and upload it to Cloudinary
      if (req.file) {
        const data = await uploadToCloudinary(req.file.path, "user-images");
        imageUrl = data.url;
        publicId = data.public_id;
      } else {
        // If no image uploaded, use the default image URL
        imageUrl = 'https://res.cloudinary.com/deaiyczro/image/upload/v1693223372/oe2tgbef87ux8afe5pty.jpg';
        publicId = 'oe2tgbef87ux8afe5pty';
      }

      // Create a new post with the image URL
      const newPost = new Post({
        title,
        content,
        user: userid,
        author,
        tags,
        imageUrl,
        publicId,
      });

      const savedPost = await newPost.save();
      res
        .status(201)
        .json({ message: "Post saved successfully", post: savedPost });
    } catch (error) {
      res.status(500).json({ error: "Error creating post", error });
    }
  }
);


// Get latest posts from all users
router.get("/latestposts", async (req, res) => {
  try {
    const latestPosts = await Post.find()
      .sort({ createdAt: -1 }) // Sort by created_at in descending order
      // .limit(10); // Limit the number of posts returned

    res.status(200).json(latestPosts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching latest posts" });
  }
});


// Get posts for authenticated user
router.get("/myposts", userauth, async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ user: userId }); // Filter posts by user's user ID

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Get posts by userId
router.get("/userposts/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    const posts = await Post.find({ user: userId }); // Filter posts by user's user ID

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Like a post 
router.post("/like/:postId", userauth, async (req, res) => {
  try {
    const postId = req.params.postId;
    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Increment the claps count and save the post
    post.likes += 1;
    await post.save();

    res.status(200).json({ message: "liked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error liking  the post", error });
  }
});


// Get a specific post by ID
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ error: "Post not found" });
  }
});

// Search a post
router.get("/searchpost/:searchTerm", async (req, res) => {
  try {
    const search = req.params.searchTerm;
    if (!search) {
      return res.status(400).json({ error: "Search term is required" });
    }
    const searchResults = await Post.find({
      $or: [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive title search
        { content: { $regex: search, $options: "i" } }, // Case-insensitive content search
        { tags: { $regex: search, $options: "i" } }, // Case-insensitive tags search
        { author: { $regex: search, $options: "i" } }, // Case-insensitive author search
      ],
    });
    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ error: "Error searching for posts", error });
  }
});

// Update a post by ID
router.put(
  "/:postId",
  userauth,
  upload.single("userImage"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Update the post fields from the request body
      post.title = req.body.title || post.title;
      post.content = req.body.content || post.content;
      post.tags = req.body.tags || post.tags;

      // If an image is uploaded, update it in Cloudinary
      if (req.file) {
        const data = await uploadToCloudinary(req.file.path, "user-images");

        // Delete the previous image from Cloudinary if it exists
        if (post.imageUrl) {
          await removeFromCloudinary(post.publicId);
        }
        post.imageUrl = data.url;
        post.publicId = data.public_id;
      }

      // Save the updated post
      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: "Error updating post", error });
    }
  }
);

// Delete a post by ID
router.delete("/:postId", async (req, res) => {
  try {
    // Find the post by ID to get the imageUrl
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // Delete the associated image from Cloudinary using the imageUrl
    if (post.publicId) {
      await removeFromCloudinary(post.publicId);
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting post", error });
  }
});

module.exports = router;
