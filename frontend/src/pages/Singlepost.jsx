import React from 'react'
import Post from '../components/Post'
import { useParams } from 'react-router-dom';


function Singlepost() {
  const { postId } = useParams();

  return (
    <div>
      <Post postId={postId}/>
    </div>
  )
}

export default Singlepost
