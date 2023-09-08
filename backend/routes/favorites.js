const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const userauth = require("../middleware/userauth");
const Post = require("../models/Post");

// Add a post to favorites
router.post("/add/:postId", userauth, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    // Check if the post is already favorited by the user
    const existingFavorite = await Favorite.findOne({ user: userId, post: postId });
    if (existingFavorite) {
      return res.status(400).json({ error: "Post is already in favorites" });
    }

    const newFavorite = new Favorite({
      user: userId,
      post: postId,
    });

    await newFavorite.save();

    res.status(200).json({ message: "Post added to favorites" });
  } catch (error) {
    res.status(500).json({ error: "Error adding post to favorites" });
  }
});

// Remove a post from favorites
router.post("/remove/:postId", userauth, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    await Favorite.findOneAndDelete({ user: userId, post: postId });

    res.status(200).json({ message: "Post removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: "Error removing post from favorites" });
  }
});

// check favorite or not
router.get("/check/:postId", userauth, async (req, res) => {
  try {
      const userId = req.user.id;
      const postId = req.params.postId;

      const existingFavorite = await Favorite.findOne({ user: userId, post: postId });
      if (existingFavorite) {
          return res.status(200).json(true);
      } else {
          return res.status(200).json(false);
      }
  } catch (error) {
      res.status(500).json({ error: "Error checking if post is favorited" });
  }
});


// Get all favorite posts for a user
router.get("/allfavs", userauth, async (req, res) => {
  try {
    const userId = req.user.id;
    const favoritePosts = await Favorite.find({ user: userId });
    const favoritePostIds = favoritePosts.map((favorite) => favorite.post);
    // Fetch the actual post data for the favorite posts
    const favoritePostData = await Post.find({ _id: { $in: favoritePostIds } });

    res.status(200).json(favoritePostData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching favorite posts", error });
  }
});


module.exports = router;