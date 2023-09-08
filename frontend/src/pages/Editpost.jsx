import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchSinglePost, fetchLatestPosts } from '../api';
import './Createpost.css';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-hot-toast';

function Editpost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(false);
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const context = useAuth();
    const { popularTags,editPost, setLatestPosts } = context;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setProgress(true);
                const singlePost = await fetchSinglePost(postId);
                setPost(singlePost);
                setTitle(singlePost.title);
                setSelectedTags(singlePost.tags);
                contentRef.current.value = singlePost.content;
                setImage(singlePost.imageUrl);
                setProgress(false);
                toast.success("Fetched Post")
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchPost();
    }, [postId]);

    const handleImageUpload = (event) => {
        setImage(event.target.files[0]);
    };

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !contentRef.current.value) {
            console.log('Title and content are required');
            return toast.error("Title and Content are required");
        }
        try {
            setProgress(true);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', contentRef.current.value);
            selectedTags.forEach((tag) => {
                formData.append('tags[]', tag);
            });
            if (image) {
                formData.append('userImage', image);
            }

            await editPost(postId, formData);
            const latestPostsResponse = await fetchLatestPosts();
            setLatestPosts(latestPostsResponse);
            setProgress(false);
            toast.success("Post Updated Successfully")
            navigate(`/post/${postId}`);
        } catch (error) {
            setProgress(false);
            console.error('Error editing post:', error);
            toast.error("Error editing post")
        }
    };

    const handleCancel = () => {
        toast.success("Post Edit Canceled")
        navigate(`/post/${postId}`);
    };

    return (
        <div className="create-post-container">
            {progress && (
                <div className="blurred-background">
                    <div className="overlay"></div>
                    <div className="spanner">
                        <div className="loader">
                            <PacmanLoader color="#ffe737" />
                        </div>
                        <p>Fetching post, please wait.</p>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="createpform">
                <div className="title-input">
                    <input
                        type="text"
                        id="title"
                        value={title}
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Title"
                    />
                </div>
                <div className="image-input">
                    <label htmlFor="image" className="imglabel">
                        <span className="labelsvg">
                            <svg className="svgIcon-use" width="25" height="25">
                                <path
                                    d="M20 12h-7V5h-1v7H5v1h7v7h1v-7h7"
                                    fillRule="evenodd"
                                ></path>
                            </svg>
                        </span>
                        <span className="select-text">Select Image</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="image"
                        onChange={handleImageUpload}
                    />
                </div>
                {image && (
                    <div className="image-preview">
                        <img
                            src={
                                image instanceof File
                                    ? URL.createObjectURL(image)
                                    : image
                            }
                            alt="Image Preview"
                        />
                    </div>
                )}
                <TextareaAutosize
                    className="edit-textarea"
                    ref={contentRef}
                    placeholder="Type a Story..."
                ></TextareaAutosize>
                <div className="tags-container">
                    <div className="tagsdis">Select Tags</div>
                    {popularTags.map((tag, index) => (
                        <div
                            key={index}
                            className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag} {selectedTags.includes(tag) && <span>✓</span>}
                        </div>
                    ))}
                </div>
                <div className="btn-container">
                    <button type="button" className="cancel-btn" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="publish-btn">
                        {progress ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Editpost;
