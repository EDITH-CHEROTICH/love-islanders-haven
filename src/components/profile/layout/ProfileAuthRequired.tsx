
import React from 'react';

const ProfileAuthRequired = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please log in to view and edit your profile.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileAuthRequired;
