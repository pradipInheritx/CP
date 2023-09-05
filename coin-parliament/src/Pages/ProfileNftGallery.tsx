import React, { useContext } from 'react'
import Album from './album'
import UserContext from 'Contexts/User';

const ProfileNftGallery = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Album userId={user?.uid || ''} />
    </>
  )
}

export default ProfileNftGallery