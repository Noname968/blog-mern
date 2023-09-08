import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Carousel.css";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

export default function Carousel({latestPosts}) {

  function formatDate(isoDate) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(isoDate).toLocaleDateString("en-US", options);
  }

  // console.log(latestPosts)
  const visiblePosts = latestPosts
  .sort((a, b) => b.likes - a.likes) // Sort by likes in descending order
  .slice(0, 3);

  return (
    <>
      <h2 className="carousel-title">Trending</h2>
      <div className="carousel-container">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          grabCursor={true}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Navigation, Autoplay]}
          className="mySwiper"
          style={{
            "--swiper-pagination-color": "#f79918",
            "--swiper-pagination-bullet-inactive-color": "rgba(0, 0, 0, 0.2)",
            "--swiper-pagination-bullet-inactive-opacity": "1",
            "--swiper-pagination-bullet-width": "8px",
            "--swiper-pagination-bullet-height": "8px",
            "--swiper-pagination-bullet-horizontal-gap": "6px",
            "--swiper-pagination-bullet-vertical-gap": "15px",
            // "--swiper-pagination-bottom": "-5px",
          }}
        >
          {visiblePosts.map((post,index) => (
            <SwiperSlide key={index}>
              <div className="carousel-content">
                <div className="carousel-left">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="carousel-image"
                  />
                </div>
                <div className="carousel-right">
                  <div className="post-meta mb-3">
                    {post.tags.map((tag, index) => (
                      <span key={tag}>
                        {index > 0 && ", "}
                        <strong>{tag}</strong>
                      </span>
                    ))}{" "}
                    —{" "}
                    <span className="date">
                      {post.createdAt && (
                        <span>{formatDate(new Date(post.createdAt))}</span>
                      )}
                    </span>
                  </div>
                  <div className="right-title">
                    <Link to={`/post/${post._id}`} className="post-title-link">
                      <h2 className="posttitle">{post.title}</h2>
                    </Link>
                  </div>
                  <div className="content-preview"                       
                  dangerouslySetInnerHTML={{
                        __html: post.content
                      }}>
                  </div>
                  <div className="authorpost">
                    <img
                      alt={post.author}
                      className="postauthimg"
                      src="https://miro.medium.com/v2/resize:fill:40:40/0*RPyfprrNVUR8PSyB"
                      width="32"
                      height="32"
                      loading="lazy"
                    />
                    <span className="postauthorname">{post.author}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
