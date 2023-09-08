import React, { useState, useEffect } from 'react';
import PostCard from '../components/Postcard';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

function Library() {
    const context = useAuth();
    const { favposts, fetchfavoriteposts } = context;
    const [progress, setProgress] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchfavoriteposts();
                setProgress(false);
            } catch (error) {
                console.error('Error fetching favorite posts:', error);
                setProgress(false);
            }
        };

        fetchData();
    }, [fetchfavoriteposts]);

    return (
        <>
            {progress ? (
                <Loader message={"Fetching Favorites, please wait."}/>
            ) : (
                <div className='homeposts'>
                    <h1 style={{ opacity: "0.6", letterSpacing: "-0.011em" }} className='searchh1'>
                        Your Library
                    </h1>
                    {favposts && favposts.length > 0 ? (
                        <div className='myposts' style={{ margin: "0 0 20px 0" }}>
                            {favposts.map((post,index) => (
                                <PostCard key={index} post={post} />
                            ))}
                        </div>
                    ) : (
                        <span className='nofound'>No Favorites Found.</span>
                    )}
                </div>
            )}
        </>
    );
}

export default Library;
