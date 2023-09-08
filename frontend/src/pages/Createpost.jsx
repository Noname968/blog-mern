import React, { useState, useEffect, useRef } from 'react';
import MediumEditor from 'medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import { useAuth } from '../context/AuthContext';
import { createPost,fetchLatestPosts } from '../api';
import './Createpost.css';
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { motion } from "framer-motion";
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

function Createpost() {
    const [title, setTitle] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(false);
    const [useRichEditor, setUseRichEditor] = useState(true); // Track user's choice
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const context = useAuth();
    const { popularTags, setLatestPosts } = context;

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

    useEffect(() => {
        if (useRichEditor) {
            const editor = new MediumEditor(contentRef.current, {
                // your Medium Editor options here
                placeholder: {
                    text: 'Type a Story...',
                    hideOnClick: false,
                },
                autoLink: true
            });

            return () => {
                editor.destroy();
            };
        }
    }, [useRichEditor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || (!useRichEditor && !contentRef.current.value)) {
            console.log('Title and content are required');
            return toast.error("Title and content are required");
        }
        try {
            setProgress(true);
            const formData = new FormData();
            formData.append('title', title);
            if (useRichEditor) {
                formData.append('content', contentRef.current.innerHTML);
            } else {
                formData.append('content', contentRef.current.value);
            }
            selectedTags.forEach((tag) => {
                formData.append('tags[]', tag);
            });
            if (image) {
                formData.append('userImage', image);
            }

            const response = await createPost(formData);
            setProgress(false);
            toast.success("Post Created Successfully");
            navigate('/');
            const postslatest =await fetchLatestPosts();
            setLatestPosts(postslatest);
        } catch (error) {
            setProgress(false);
            console.error('Error creating post:', error);
            toast.error("Error Creating Post");
        }
    };

    const handleCancel = () => {
        toast.success("Post not created")
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className="create-post-container">
                {progress && (
                    <Loader message={"Creating post, please wait."} />
                )}
                <form onSubmit={handleSubmit} className="createpform">
                    <div className="title-input" >
                        <input
                            type="text"
                            id="title"
                            value={title}
                            // required
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
                            <img src={URL.createObjectURL(image)} alt="Image Preview" />
                        </div>
                    )}
                    <div className="editor-toggle d-flex">
                        <label className="form-check-label" htmlFor="editorToggle">
                            Use Text Editor
                        </label>
                        <div className="form-check form-switch mx-2">
                            <input
                                className="form-check-input float-end"
                                type="checkbox"
                                role="switch"
                                id="editorToggle"
                                checked={useRichEditor}
                                onChange={() => setUseRichEditor(!useRichEditor)}
                            />
                        </div>
                        <label className="form-check-label" htmlFor="editorToggle">
                            Use Medium Editor
                        </label>
                    </div>
                    <div className="editor-container">
                        {useRichEditor ? (
                            <div ref={contentRef} className="editable"></div>
                        ) : (
                            <TextareaAutosize
                                className="custom-textarea"
                                ref={contentRef}
                                placeholder="Type a Story..."
                            ></TextareaAutosize>
                        )}
                    </div>
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
                            {progress ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default Createpost;

