import React, { useState, useEffect, useRef } from "react";
import { fetchSinglePost, fetchComments, fetchLatestPosts } from "../api";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Post.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useAuth } from "../context/AuthContext";
import Comments from "../pages/Comments";
import Loader from "./Loader";
import toast from 'react-hot-toast'

export default function Singlepost() {
  const { postId } = useParams();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [copied, setCopied] = useState(false);
  const {
    fetchAndSetUserDetails,
    currentUser,
    followUser,
    unfollowUser,
    Likepost,
    checkIfPostIsFavorited,
    addToFavorites,
    removeFromFavorites,
    deletePost,
    setLatestPosts,
  } = useAuth();
  const [progress, setprogress] = useState(false);
  const [comments, setComments] = useState([]);
  const ref = useRef(null);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const fetchPostAndUser = async () => {
      try {
        setprogress(true);
        const singlePost = await fetchSinglePost(postId);
        setPost(singlePost);
        // Fetch user details using the author's ID
        const userDetails = await fetchAndSetUserDetails(singlePost.user);
        setUser(userDetails);
        setprogress(false);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchPostAndUser();
  }, [postId, fetchAndSetUserDetails, currentUser, Likepost]);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return readTimeMinutes;
  };

  function formatDate(isoDate) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(isoDate).toLocaleDateString("en-US", options);
  }

  const handleFollow = () => {
    followUser(user._id);
    toast.success("Following Author")
  };

  const handleUnfollow = () => {
    unfollowUser(user._id);
    toast.success("Unfollowed Author")
  };

  const handlelikes = async () => {
    try {
      await Likepost(postId); // Call the API function to clap for the post
      const updatedPost = await fetchSinglePost(postId); // Fetch the post again to get updated data
      setPost(updatedPost);
      toast.success("Liked Post")
    } catch (error) {
      console.log(error);
      toast.error("Error Liking post")
    }
  };

  const scrollToComments = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchcomments();
  }, []);

  const fetchcomments = async () => {
    try {
      const fetchedComments = await fetchComments(postId);
      setComments(fetchedComments.reverse());
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchPostIsFavorited = async () => {
      if (currentUser) {
        const favorited = await checkIfPostIsFavorited(postId);
        setIsInFavorites(favorited);
      }
    };
    fetchPostIsFavorited();
  }, [currentUser, postId, checkIfPostIsFavorited]);

  const handleFavorite = async () => {
    try {
      if (isInFavorites) {
        await removeFromFavorites(postId);
        setIsInFavorites(false);
        toast.success("Removed from Library")
      } else {
        await addToFavorites(postId);
        setIsInFavorites(true);
        toast.success("Added to Library")
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        // Call the deletePost function from your auth context
        await deletePost(postId);
        if (isInFavorites) {
          await removeFromFavorites(postId);
          setIsInFavorites(false);
        }
        toast.success("Post Deleted Successfully")
        const latestPostsResponse = await fetchLatestPosts();
        setLatestPosts(latestPostsResponse);
        history("/");
        // setPosts(posts.filter((post) => post._id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Error Deleting Post")
      }
    }
  };

  if (!post) {
    return (
      <>
        {progress && (
          <Loader message={"Fetching Post details"} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="singlepost">
        <div className="postcontainer">
          <div className="postheader">
            <h1 className="post-title">{post.title}</h1>
            <div className="header-middle">
              <img
                alt={post.author}
                className="authorimg"
                src="https://miro.medium.com/v2/resize:fill:40:40/0*RPyfprrNVUR8PSyB"
                width="45"
                height="45"
                loading="lazy"
              />
              <div className="authcontrol">
                <div className="authorinfo">
                  <div className="authfollow">
                    <Link to={`/profile/${post.user}`} style={{ textDecoration: "none", color:"black" }}  >
                      <span className="authorname">{post.author}</span>
                    </Link>
                    <span className="dot">.</span>
                    {!currentUser ? (
                      <Link to={'/login'} style={{ textDecoration: "none" }}><button className="followbtn">Login</button></Link>
                    ) : (
                      <>
                        {user && user._id !== currentUser._id ? (
                          <>
                            {currentUser.following.includes(user._id) ? (
                              <button onClick={handleUnfollow} className="followbtn">
                                Following
                              </button>
                            ) : (
                              <button onClick={handleFollow} className="followbtn">
                                Follow
                              </button>
                            )}
                          </>
                        ) : (
                          <span>Your Post</span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="contenttime">
                    <span className="readtime">
                      {calculateReadTime(post.content)} min read
                    </span>
                    <span className="dot">.</span>
                    {user && (
                      <span className="joindate">
                        {formatDate(post.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
                {currentUser && currentUser._id === post.user && (
                  <div className="postmodify">
                    <Link to={`/edit/${postId}`}>
                      <span
                        className="edit"
                        data-tooltip-content="Edit"
                        data-tooltip-id="edit-tooltip"
                      >
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          height="1.2em"
                          width="1.2em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </span>
                    </Link>
                    <ReactTooltip className={"tooltip"} id="edit-tooltip" />
                    <span
                      className="delete"
                      data-tooltip-content="Delete"
                      data-tooltip-id="delete-tooltip"
                      onClick={handleDeletePost}
                    >
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        height="1.2em"
                        width="1.2em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </span>
                    <ReactTooltip className={"tooltip"} id="delete-tooltip" />
                  </div>
                )}
              </div>
            </div>
            <div className="headerbottom">
              <div className="hbleft">
                <div
                  className="likes"
                  onClick={currentUser && handlelikes}
                  data-tooltip-id="share-tooltip"
                  data-tooltip-content={currentUser ? "Like" : "Log in to Like"}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    aria-label="clap"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"
                    ></path>
                  </svg>
                  <span>{post.likes}</span>
                  <ReactTooltip className={"tooltip"} id="like-tooltip" />
                </div>
                <div
                  className="comments"
                  onClick={scrollToComments}
                  data-tooltip-id="share-tooltip"
                  data-tooltip-content="Comments"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="vg"
                  >
                    <path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
                  </svg>
                  <span>{comments.length}</span>
                  <ReactTooltip className={"tooltip"} id="comment-tooltip" />
                </div>
              </div>
              <div className="hbright">
                <div
                  className="favorites"
                  onClick={currentUser && handleFavorite}
                  data-tooltip-id="favorite-tooltip"
                  data-tooltip-content={
                    currentUser
                      ? isInFavorites
                        ? "Saved"
                        : "Save"
                      : "Login to Favorite"
                  }
                >
                  {!isInFavorites ? (
                    <svg
                      className="line"
                      width={"21"}
                      height={"21"}
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.5 10.6499H9.5" strokeMiterlimit="10"></path>
                      <path d="M12 8.20996V13.21" strokeMiterlimit="10"></path>
                      <path d="M16.8199 2H7.17995C5.04995 2 3.31995 3.74 3.31995 5.86V19.95C3.31995 21.75 4.60995 22.51 6.18995 21.64L11.0699 18.93C11.5899 18.64 12.4299 18.64 12.9399 18.93L17.8199 21.64C19.3999 22.52 20.6899 21.76 20.6899 19.95V5.86C20.6799 3.74 18.9499 2 16.8199 2Z"></path>
                    </svg>
                  ) : (
                    <svg
                      className="saved"
                      width={"21"}
                      height={"21"}
                      viewBox="0 0 24 24"
                    >
                      <path d="M16.8203 1.91016H7.18031C5.06031 1.91016 3.32031 3.65016 3.32031 5.77016V19.8602C3.32031 21.6602 4.61031 22.4202 6.19031 21.5502L11.0703 18.8402C11.5903 18.5502 12.4303 18.5502 12.9403 18.8402L17.8203 21.5502C19.4003 22.4302 20.6903 21.6702 20.6903 19.8602V5.77016C20.6803 3.65016 18.9503 1.91016 16.8203 1.91016ZM15.6203 9.03016L11.6203 13.0302C11.4703 13.1802 11.2803 13.2502 11.0903 13.2502C10.9003 13.2502 10.7103 13.1802 10.5603 13.0302L9.06031 11.5302C8.77031 11.2402 8.77031 10.7602 9.06031 10.4702C9.35031 10.1802 9.83031 10.1802 10.1203 10.4702L11.0903 11.4402L14.5603 7.97016C14.8503 7.68016 15.3303 7.68016 15.6203 7.97016C15.9103 8.26016 15.9103 8.74016 15.6203 9.03016Z"></path>
                    </svg>
                  )}{" "}
                </div>
                <ReactTooltip className={"tooltip"} id="favorite-tooltip" />
                <CopyToClipboard
                  text={window.location.href}
                  onCopy={() => setCopied(true)}
                >
                  <div
                    className="share"
                    data-tooltip-id="share-tooltip"
                    data-tooltip-content={copied ? "Link Copied!" : "Copy link"}
                  >
                    <svg
                      className="linep"
                      width={"21"}
                      height={"21"}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                    </svg>
                  </div>
                </CopyToClipboard>
                <ReactTooltip className={"tooltip"} id="share-tooltip" />
              </div>
            </div>
          </div>
          <div className="postcimgcon">
            <img src={post.imageUrl} alt="postimg" className="postcimg" />

          </div>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          <div className="posttags" ref={ref}>
            {post &&
              post.tags.map((tag, index) => (
                <div key={index} className="posttag">
                  <span>{tag}</span>
                </div>
              ))}
          </div>
          <Comments
            postId={postId}
            comments={comments}
            setComments={setComments}
          />
        </div>
      </div>
    </>
  );
}
