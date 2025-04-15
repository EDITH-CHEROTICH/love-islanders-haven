
import React from 'react';

const Support: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Support</h1>
        <div className="bg-island-dark/80 backdrop-blur-md border border-island-light/30 rounded-lg p-6">
          <p className="text-white mb-4">
            Need help with your account or have questions about our service?
            Our support team is here to help.
          </p>
          <a 
            href="mailto:support@loveislanders.com" 
            className="inline-block bg-love hover:bg-love-dark text-white px-4 py-2 rounded transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Support;
