
import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pt-4 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Terms of Service</h1>
        <div className="bg-island-dark/80 backdrop-blur-md border border-island-light/30 rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using our service, you agree to be bound by these Terms.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">2. Privacy Policy</h2>
          <p className="mb-4">
            Please review our Privacy Policy to understand how we collect and use your information.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your account and password.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">4. Content Guidelines</h2>
          <p className="mb-4">
            You agree not to post content that is harmful, offensive, or violates the rights of others.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">5. Service Modifications</h2>
          <p>
            We reserve the right to modify or discontinue the service at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
