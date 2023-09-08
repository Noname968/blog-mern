import React, { useState, useEffect } from 'react';
import { fetchmyPosts } from '../api';
import PostCard from '../components/Postcard';
import Loader from '../components/Loader';

function Stories() {
    const [myposts, setmyposts] = useState([]);
    const [progress,setprogress] = useState(false)

    useEffect(() => {
        fetchmyposts();
    }, []);

    const fetchmyposts = async () => {
        try {
            setprogress(true)
            const response = await fetchmyPosts();
            setmyposts(response);
            setprogress(false)
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    return (
        <>
            {progress && (
                <Loader message={"Fetching Stories, please wait."}/>
            )}
            <div className='homeposts'>
                <h1 style={{ opacity: "0.6", letterSpacing: "-0.011em" }} className='searchh1'>Your Stories</h1>
                {myposts && myposts.length > 0 ? (
                    <div className='myposts' style={{ margin: "0 0 20px 0" }}>
                        {myposts.map((post,index) => (
                            <PostCard key={index} post={post} />
                        ))}
                    </div>
                ) : (
                    <span className='nofound'>No Posts Found.</span>
                )}
            </div>
        </>
    );
}

export default Stories;
