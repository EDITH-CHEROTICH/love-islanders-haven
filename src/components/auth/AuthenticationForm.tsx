
import React from 'react';
import EmailAuthForm from './EmailAuthForm';
import VerificationForm from './VerificationForm';

interface AuthenticationFormProps {
  isEmailSubmitted: boolean;
  email: string;
  verificationCode: string;
  isSendingCode: boolean;
  onEmailSubmit: (email: string, code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  onVerifySuccess: () => Promise<void>;
}

const AuthenticationForm: React.FC<AuthenticationFormProps> = ({
  isEmailSubmitted,
  email,
  verificationCode,
  isSendingCode,
  onEmailSubmit,
  onResendCode,
  onVerifySuccess
}) => {
  return (
    <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gradient text-center mb-6">
        {isEmailSubmitted ? "Verify Your Email" : "Sign In / Sign Up"}
      </h1>
      
      {isEmailSubmitted ? (
        <VerificationForm 
          email={email}
          generatedCode={verificationCode}
          onResendCode={onResendCode}
          isSendingCode={isSendingCode}
          onClose={onVerifySuccess}
        />
      ) : (
        <EmailAuthForm onEmailSubmit={onEmailSubmit} />
      )}
    </div>
  );
};

export default AuthenticationForm;
