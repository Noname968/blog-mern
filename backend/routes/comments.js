const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const userauth = require("../middleware/userauth");

// Create a new comment for a specific post
router.post("/create", userauth, async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id;
    const username = req.user.username
    console.log(postId)

    if (!postId || !content) {
      return res.status(400).json({ error: "Post ID and comment content are required" });
    }

    const newComment = new Comment({
      username,
      user: userId,
      postId, // This can be sent as a string now
      content,
    });

    const savedComment = await newComment.save();
    res.status(201).json({ message: "Comment saved successfully", comment: savedComment });
  } catch (error) {
    res.status(500).json({ error: "Error creating comment" });
  }
});

// Get comments for a specific post
router.get("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId:postId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching comments" });
  }
});

// Update a comment
router.put("/update/:commentId", userauth, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const { content } = req.body;

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: userId },
      { content },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ error: "Error updating comment" });
  }
});

// Delete a comment
router.delete("/delete/:commentId", userauth, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      user: userId,
    });

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
});

module.exports = router;
