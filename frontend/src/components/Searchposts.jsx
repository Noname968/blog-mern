import React from 'react';
import { useLocation } from 'react-router-dom';
import PostCard from './Postcard';
import './Postcard.css'

function Searchposts() {
    const location = useLocation();
    const searchResults = location.state && location.state.searchResults;

    return (
        <div className='homeposts'>
            <h1 style={{opacity:"0.6",letterSpacing:"-0.011em"}} className='searchh1'>Search Results</h1>
            {searchResults && searchResults.length > 0 ? (
                <div className='myposts' style={{margin:"0 0 20px 0"}}>
                    {searchResults.map((post,index) => (
                        <PostCard key={index} post={post}/>
                    ))}
                </div>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
}

export default Searchposts;
