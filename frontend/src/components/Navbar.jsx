import React, { useState, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import blog from '../assets/BLOG1.png';
import { searchPosts } from '../api';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const [isCreatePostPage, setIsCreatePostPage] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const navRef = useRef();
    const { isLoggedIn, currentUser } = useAuth();

    React.useEffect(() => {
        setIsCreatePostPage(location.pathname === '/create-post');
    }, [location.pathname]);


    const isactive = (path) => {
        return location.pathname === path;
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            if (searchTerm.trim() === '') {
                return;
            }
            const results = await searchPosts(searchTerm);
            setSearchTerm("")
            navigate('/search-results', { state: { searchResults: results } });
            closeNavbar();
        } catch (error) {
            console.error('Error searching for posts:', error);
        }
    };

    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    };

    const closeNavbar = () => {
        navRef.current.classList.remove("responsive_nav");
    };

    return (
        <div className="navbar">
            <div className="navleft">
                <div className="navsymbol">
                    <Link to={'/'}>
                        <img src={blog} alt="" />
                    </Link>
                </div>
            </div>
            <div className="navright">
                <div className="rightel" ref={navRef}>
                    <div className="navsearch">
                        <div className="navsearchsvg">
                            <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </div>
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search Blog"
                                className="navinput"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>
                    {isLoggedIn && currentUser ? (
                        <div className="rightsymbols">
                            {isCreatePostPage ? (
                                <></>
                            ) : (
                                <>
                                    <div className="createpost" onClick={closeNavbar}>
                                        <Link to="/create-post" className="createpost">
                                            <svg
                                                width="21"
                                                height="21"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                aria-label="Write"
                                            >
                                                <path
                                                    d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z"
                                                    fill="currentColor"
                                                ></path>
                                                <path
                                                    d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5m-2-2l2 2"
                                                    stroke="currentColor"
                                                ></path>
                                            </svg>
                                            <div className="postwrite">Write</div>
                                        </Link>
                                    </div>
                                </>
                            )}
                            <div className="stories"  onClick={closeNavbar}>
                                <Link to={'/stories'} className='createpost'>
                                    <svg width="20" className="svgstories" height="20" viewBox="0 0 24 24" fill="none" aria-label="Stories"><path d="M4.75 21.5h14.5c.14 0 .25-.11.25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .14.11.25.25.25z" stroke="currentColor" fill={isactive('/stories') ? 'black' : 'none'}></path><path d="M8 8.5h8M8 15.5h5M8 12h8" stroke={isactive('/stories') ? 'white' : 'currentcolor'} strokeLinecap="round"></path></svg>
                                    <span>Stories</span>
                                </Link>
                            </div>
                            <div className="stories"  onClick={closeNavbar}>
                                <Link to={'/library'} className='createpost'>
                                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-label="Lists"><path d="M6.44 6.69h0a1.5 1.5 0 0 1 1.06-.44h9c.4 0 .78.16 1.06.44l.35-.35-.35.35c.28.28.44.66.44 1.06v14l-5.7-4.4-.3-.23-.3.23-5.7 4.4v-14c0-.4.16-.78.44-1.06z" stroke="currentColor" fill={isactive('/library') ? 'black' : 'none'}></path><path d="M12.5 2.75h-8a2 2 0 0 0-2 2v11.5" stroke="currentColor" strokeLinecap="round" ></path></svg>
                                    <span>Library</span>
                                </Link>
                            </div>
                            <div className="profile-icon"  onClick={closeNavbar}>
                                <Link to={'/profile'} className='createpost'>
                                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-label="Profile"><circle cx="12" cy="7" r="4.5" stroke={isactive('/profile') ? 'black' : 'currentcolor'}></circle><path d="M3.5 21.5v-4.34C3.5 15.4 7.3 14 12 14s8.5 1.41 8.5 3.16v4.34" stroke={isactive('/profile') ? 'black' : 'currentcolor'} strokeLinecap="round"></path></svg>
                                    <span style={{ margin: "0 0 0 4px" }}>Profile</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className='rightsymbols'>
                            <div className="profile-icon"  onClick={closeNavbar}>
                                <Link to={'/login'} className='createpost'>
                                    <span style={{ margin: "0 0 0 0px" }} className='loginp'>Login</span>
                                </Link>
                            </div>
                        </div>
                    )}
                    <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <button className="nav-btn" onClick={showNavbar}>
                    <i className="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
        </div>
    );
}

export default Navbar;