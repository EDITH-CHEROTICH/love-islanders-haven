
import React from "react";

interface AuthToggleProps {
  isLoginMode: boolean;
  toggleAuthMode: () => void;
}

const AuthToggle = ({ isLoginMode, toggleAuthMode }: AuthToggleProps) => {
  return (
    <div className="mt-6 text-center text-sm">
      <button 
        type="button"
        className="text-love hover:underline"
        onClick={toggleAuthMode}
      >
        {isLoginMode 
          ? "Don't have an account? Sign up instead" 
          : "Already have an account? Log in instead"}
      </button>
    </div>
  );
};

export default AuthToggle;
