import React, { useState } from "react";
import Carousel from "../components/Carousel";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/Postcard";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import toast from 'react-hot-toast'
import Footer from '../components/Footer'

function Homepage() {
  const context = useAuth();
  const { latestPosts } = context;
  const [numPostsToShow, setNumPostsToShow] = useState(7);

  const loadMorePosts = () => {
    setNumPostsToShow((prevNum) => prevNum + 6);
    toast.success("Loaded more Posts")
  };

  if (!latestPosts) {
    return <Loader message={"Fetching data..."} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {!latestPosts ? (
        <Loader message={"Fetching latest posts"} />
      ) : (
        <>
          <Carousel latestPosts={latestPosts} />
          <div className="homeposts">
            <h2 style={{ textAlign: "center", margin: "40px 0 10px 0" }}>
              Latest Posts
            </h2>
            <div className="myposts">
              {latestPosts.slice(0, numPostsToShow).map((post, index) => (
                <PostCard key={index} post={post} />
              ))}
            </div>
            {latestPosts.length > numPostsToShow && (
              <button onClick={loadMorePosts} className="loadmorebtn">
                Load More
              </button>
            )}
          </div>
          <Footer/>
        </>
      )}
    </motion.div>
  );
}

export default Homepage;
