import React from 'react'
import Album from './album'

const FwProfileNftGallery = () => {
  const followerUserId = localStorage.getItem("followerId")
  return (
    <Album userId={followerUserId || ''} isFollower={true} />
  )
}

export default FwProfileNftGallery