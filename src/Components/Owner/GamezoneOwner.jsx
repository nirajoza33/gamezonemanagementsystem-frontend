import React from 'react'
import OwnerNavbar from './OwnerNavbar'

const GamezoneOwner = () => {
  return (
    <div>
      <OwnerNavbar />
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: '#000', // optional: to make white text visible
          color: 'white',
          textAlign: 'center'
        }}
      >
        <h1>This is gamezone owner page</h1>

      </div>

    </div>
  )
}

export default GamezoneOwner
