
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Privacy Policy</h1>
        <div className="bg-island-dark/80 backdrop-blur-md border border-island-light/30 rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-3">Data Collection</h2>
          <p className="mb-4">
            We collect information you provide directly to us when you create an account,
            complete your profile, or communicate with other users.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">Use of Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services,
            develop new features, and protect our users.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">Data Sharing</h2>
          <p className="mb-4">
            We do not share your personal information with third parties except as described in this policy.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">Security</h2>
          <p className="mb-4">
            We implement measures designed to protect your information, but no method of transmission
            over the Internet is 100% secure.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">Changes to Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of any changes by posting
            the new policy on this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
